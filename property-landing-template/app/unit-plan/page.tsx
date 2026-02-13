import Link from 'next/link';
import { Eyebrow, Title, Paragraph, Button } from '@your-org/design-system';
import ScrollToContactButton from '@/components/ScrollToContactButton';

export const metadata = {
  title: '세대안내 | 금정역호계푸르지오',
  description: '라이프스타일에 맞게 선택하는 다양한 평면 구성, 세대안내.',
};

const UNIT_TYPES = [
  { code: '59A', size: '전용 59m²', desc: '컴팩트한 구조에 알찬 수납과 효율적인 동선 설계' },
  { code: '74A', size: '전용 74m²', desc: '3Bay 구조와 넉넉한 팬트리로 가족형 평면에 적합' },
  { code: '84A', size: '전용 84m²', desc: '광폭 거실과 대형 드레스룸을 갖춘 대표 타입' },
];

export default function UnitPlanPage() {
  return (
    <div
      className="w-full"
      style={{
        backgroundColor: 'rgb(var(--color-surface))',
        color: 'rgb(var(--color-onsurface))',
      }}
    >
      <section className="section-shell">
        <div className="section-inner flex flex-col gap-6">
          <Eyebrow>세대안내</Eyebrow>
          <Title>
            라이프스타일에 맞게 선택하는
            <br />
            다양한 평면 구성
          </Title>
          <Paragraph>
            예시 분양 사이트처럼 대표 타입만 먼저 보여주고, 실제 평면도는
            이미지 또는 모달로 연결하는 구조를 가정합니다.
          </Paragraph>
          <div className="flex flex-wrap gap-3">
            <Link href="/overview">
              <Button as="span" size="md">
                단지 개요 다시 보기
              </Button>
            </Link>
            <ScrollToContactButton size="md">분양 문의하기</ScrollToContactButton>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid gap-6 md:grid-cols-3">
          {UNIT_TYPES.map((type) => (
            <div
              key={type.code}
              className="flex flex-col gap-3 rounded-xl border border-slate-300/70 bg-white/85 p-5 shadow-sm"
            >
              <Eyebrow>{type.code}</Eyebrow>
              <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">{type.size}</h2>
              <Paragraph>{type.desc}</Paragraph>
              <UnitPlanViewButton code={type.code} />
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner flex flex-col gap-4">
          <Eyebrow>DETAIL PLANS</Eyebrow>
          <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">타입별 상세 평면도</h2>
          <Paragraph>
            여기에는 실제 CAD 기반 평면도 이미지나 3D 투시도를 배치합니다.
          </Paragraph>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-400/60 text-sm text-slate-400">
              59 타입 평면도 이미지 영역
            </div>
            <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-400/60 text-sm text-slate-400">
              74 / 84 타입 평면도 이미지 영역
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UnitPlanViewButton({ code }: { code: string }) {
  return (
    <Button as="span" size="sm">
      평면도 보기
    </Button>
  );
}
