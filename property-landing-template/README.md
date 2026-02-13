# landing-template

Next.js + Tailwind 기반 랜딩 페이지 템플릿입니다.

- **Design System**은 별도 라이브러리(`@your-org/design-system`)를 참조합니다.
- 디자인 시스템과 함께 복제하여 독립적인 프로젝트 생태계로 사용할 수 있습니다.

## 사용법

```bash
npm install
npm run dev
```

- `app/page.tsx` 에서 섹션 단위로 구성되어 있습니다.
- 마지막 섹션(`ContactSection`)은 `/api/contact`로 POST 요청을 보내는 문의 폼 예시입니다.

## 프로젝트 복제 시

이 프로젝트를 복제하여 독립적인 프로젝트로 사용할 때:

1. **디자인 시스템과 함께 복제**: `design-system`과 `property-landing-template`을 함께 복제합니다.
2. **iframe 설정 제거**: 독립 실행 시 `.env` 파일에서 `NEXT_PUBLIC_USE_IFRAME`을 설정하지 않거나 `false`로 설정합니다.
3. **의존성 확인**: `package.json`의 `@your-org/design-system`이 `file:../design-system`으로 올바르게 참조되는지 확인합니다.