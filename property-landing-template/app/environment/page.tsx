export const metadata = {
  title: '입지환경 | 금정역호계푸르지오',
  description: '교통, 교육, 생활 인프라 등 금정역 호계푸르지오 주변 입지환경을 소개합니다.',
};

export default function EnvironmentPage() {
  return (
    <div className="section-shell pt-16">
      <div className="section-inner flex flex-col gap-6 py-12">
        <div>
          <h1 className="text-2xl font-bold">입지환경</h1>
          <p className="mt-2 text-sm text-slate-600">
            교통, 교육, 생활 인프라 등 금정역 호계푸르지오 주변 입지환경을 소개합니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold">교통</h2>
            <p className="mt-2 text-xs text-slate-600">
              지하철, 버스, 도로망 등 교통 편의 정보를 입력해주세요.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold">교육</h2>
            <p className="mt-2 text-xs text-slate-600">
              인근 초·중·고 및 학원가 등 교육 환경을 입력해주세요.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold">생활 인프라</h2>
            <p className="mt-2 text-xs text-slate-600">
              마트, 병원, 공원 등 생활 편의시설 정보를 입력해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
