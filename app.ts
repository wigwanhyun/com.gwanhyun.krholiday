import Homey from 'homey';

// API 응답 데이터 타입 정의 (공공데이터포털 스펙 기반)
interface HolidayItem {
  dateKind: string;
  dateName: string;
  isHoliday: 'Y' | 'N';
  locdate: number; // YYYYMMDD 숫자 형태
  seq: number;
}

interface HolidayApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: HolidayItem | HolidayItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 캐시 데이터 인터페이스
interface HolidayCache {
  month: string; // YYYYMM
  holidays: string[]; // ['20240101', '20240209', ...]
}

class KoreanHolidayApp extends Homey.App {
  private cache: HolidayCache | null = null;

  async onInit(): Promise<void> {
    this.log('KoreanHolidayApp has been initialized (TypeScript)');

    // Flow 조건 카드 등록
    this.homey.flow.getConditionCard('is_korean_holiday')
      .registerRunListener(async (args: { flag: string }, state: any) => {
        const isHoliday = await this.checkIfHoliday();
        
        // 사용자가 "맞다면(true)"을 선택했는지 "아니라면(false)"을 선택했는지 확인
        const expected = args.flag === 'true';
        return isHoliday === expected;
      });
  }

  /**
   * 오늘이 공휴일인지 확인하는 로직
   */
  private async checkIfHoliday(): Promise<boolean> {
    const serviceKey = this.homey.settings.get('service_key') as string | null;

    if (!serviceKey) {
      this.error('Service Key is missing in Settings.');
      return false; // 키가 없으면 평일로 간주 (Fail-safe)
    }

    const now = new Date();
    // 한국 시간(KST) 계산: UTC + 9시간
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);

    const year = kstDate.getUTCFullYear();
    const monthRaw = kstDate.getUTCMonth() + 1;
    const dayRaw = kstDate.getUTCDate();

    const monthStr = String(monthRaw).padStart(2, '0');
    const dayStr = String(dayRaw).padStart(2, '0');
    const todayString = `${year}${monthStr}${dayStr}`; // YYYYMMDD
    const monthKey = `${year}${monthStr}`;

    // 1. 캐시 확인
    if (this.cache && this.cache.month === monthKey) {
      this.log(`Cache hit for ${monthKey}`);
      return this.cache.holidays.includes(todayString);
    }

    // 2. API 호출
    this.log(`Fetching holidays for ${monthKey} from API...`);
    const holidays = await this.fetchHolidaysFromApi(year, monthStr, serviceKey);

    // 3. 캐시 업데이트
    this.cache = {
      month: monthKey,
      holidays: holidays,
    };

    return holidays.includes(todayString);
  }

  /**
   * 공공데이터포털 API 호출 함수
   */
  private async fetchHolidaysFromApi(year: number, month: string, serviceKey: string): Promise<string[]> {
    // Decoding Key를 사용하는 것이 일반적이나, URL Encoding 문제 발생 시 인코딩 키 시도 필요
    const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&solMonth=${month}&ServiceKey=${serviceKey}&_type=json&numOfRows=100`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json() as HolidayApiResponse;
      const itemsBody = data.response?.body?.items?.item;

      if (!itemsBody) {
        return [];
      }

      // items.item은 하나일 때 객체, 여러 개일 때 배열로 옴
      const items = Array.isArray(itemsBody) ? itemsBody : [itemsBody];

      // isHoliday === 'Y' 인 날짜만 추출하여 문자열 배열로 반환
      return items
        .filter((item) => item.isHoliday === 'Y')
        .map((item) => String(item.locdate));

    } catch (error) {
      this.error('Failed to fetch holidays:', error);
      return []; // 에러 발생 시 빈 배열 반환 (보수적 접근)
    }
  }
}

module.exports = KoreanHolidayApp;