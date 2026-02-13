/**
 * 테마(라이트/다크)를 localStorage에서 읽어 document에 적용.
 * FOUC 방지를 위해 body 직후에 실행되도록 배치.
 */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var t=(typeof localStorage!=='undefined'&&localStorage.getItem('theme'))||'light';document.documentElement.dataset.theme=t;})();`,
      }}
    />
  );
}
