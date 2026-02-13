import LocationMap from '@/components/LocationMap';

export const metadata = {
  title: '오시는 길 | 금정역호계푸르지오',
  description: '경기 안양시 동안구 엘에스로116번길 56, 금정역호계푸르지오아파트 오시는 길.',
};

export default function LocationPage() {
  return (
    <div className="section-shell pt-16">
      <div className="section-inner flex flex-col gap-6 py-12">
        <div>
          <h1 className="text-2xl font-bold">오시는 길</h1>
          <p className="mt-2 text-sm text-slate-600">
            경기 안양시 동안구 엘에스로116번길 56, 금정역호계푸르지오아파트
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <LocationMap />
          <p className="text-xs text-slate-500">
            네이버 지도를 기반으로 위치가 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
