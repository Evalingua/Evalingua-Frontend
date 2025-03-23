import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  back?: boolean;
}
const Breadcrumb = ({ pageName, back }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className='flex items-center gap-2 text-black dark:text-white'>
        { back && (
            <button onClick={() => window.history.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 1024 1024"><path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"/><path fill="currentColor" d="m237.248 512l265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"/></svg>
            </button>
        )}
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageName}
        </h2>
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Evalingua /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
