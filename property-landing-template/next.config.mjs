/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 디자인 시스템 패키지 트랜스파일
  transpilePackages: ['@your-org/design-system'],
  
  // 배럴 파일 최적화 (Next.js 13.5+)
  // 배럴 파일에서 실제 사용하는 것만 트리쉐이킹
  optimizePackageImports: [
    '@your-org/design-system',
  ],
  
  // 컴파일러 최적화 (SWC 사용)
  swcMinify: true,
  compiler: {
    // 프로덕션에서 불필요한 console 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 개발 모드 최적화
  // iframe( app-shell )에서 로드할 때만 필요 (독립 실행 시 불필요)
  ...(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_IFRAME === 'true' && {
    // iframe( app-shell )에서 로드할 때 청크 URL이 올바른 origin 으로 요청되도록
    assetPrefix: 'http://localhost:3000',
  }),
  
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 압축 설정
  compress: true,
  
  // 프로덕션 빌드 최적화
  ...(process.env.NODE_ENV === 'production' && {
    // 정적 페이지 최적화
    output: 'standalone',
  }),
  
  // 헤더 설정 (iframe 사용 시에만 필요)
  async headers() {
    // 독립 실행 시 CSP 헤더 불필요
    if (process.env.NEXT_PUBLIC_USE_IFRAME !== 'true') {
      return [];
    }
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:5173 http://localhost:3000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
