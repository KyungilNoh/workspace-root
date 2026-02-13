import Link from 'next/link';
import { Eyebrow, Title, Paragraph, Button } from '@your-org/design-system';
import ScrollToContactButton from '@/components/ScrollToContactButton';

export const metadata = {
  title: '개요 | 금정역호계푸르지오',
  description:
    '새로운 주거 기준을 제시하는 도심 복합 라이프스타일 단지, 금정역 호계 푸르지오 개요.',
};

export default function OverviewPage() {
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
          <Eyebrow>OVERVIEW</Eyebrow>
          <Title>
            새로운 주거 기준을 제시하는
            <br />
            도심 복합 라이프스타일 단지
          </Title>
          <Paragraph>
            이 랜딩 템플릿은 예시 부동산 분양 페이지처럼
            <strong> 개요 / 유닛 타입 / 위치 / 문의 </strong>
            등 주요 정보를 섹션 단위로 나누어 구성할 수 있도록 설계되어 있습니다.
          </Paragraph>
          <div className="flex flex-wrap gap-3">
            <Link href="/unit-plan">
              <Button as="span" size="md">
                유닛 타입 보러가기
              </Button>
            </Link>
            <ScrollToContactButton size="md">분양 문의 바로가기</ScrollToContactButton>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">입지 가치</h2>
            <Paragraph>
              예시 사이트처럼 &lsquo;역세권 / 몰세권 / 학세권&rsquo; 등
              핵심 입지 키워드를 짧게 정리합니다.
            </Paragraph>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">상품 구성</h2>
            <Paragraph>
              전용 59·74·84m² 등 대표 타입을 요약하고,
              자세한 평면 구성은 &lsquo;UNIT PLAN&rsquo; 화면에서 안내합니다.
            </Paragraph>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">브랜드 &amp; 특화</h2>
            <Paragraph>
              시공사 / 시행사 브랜드, 커뮤니티 시설, 설계 특화 포인트 등을 정리합니다.
            </Paragraph>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-inner grid gap-6 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Eyebrow>세대수</Eyebrow>
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">총 000세대</h2>
            <Paragraph>실제 분양 시 세대수/동수 정보를 입력합니다.</Paragraph>
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow>규모</Eyebrow>
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">지하 0층 ~ 지상 0층</h2>
            <Paragraph>층수/동수 등 기본 스펙을 요약합니다.</Paragraph>
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow>전용 면적</Eyebrow>
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">59 · 74 · 84m²</h2>
            <Paragraph>대표 타입만 노출하고 상세는 Unit Plan에서 안내합니다.</Paragraph>
          </div>
          <div className="flex flex-col gap-1">
            <Eyebrow>입주시기</Eyebrow>
            <h2 className="text-lg md:text-xl font-medium text-onsurface tracking-tight">예정 20XX년 XX월</h2>
            <Paragraph>실제 일정만 교체하면 재사용 가능한 구조입니다.</Paragraph>
          </div>
        </div>
      </section>
    </div>
  );
}
