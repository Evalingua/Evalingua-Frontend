import React, { useEffect, useRef, useState } from 'react';

export type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

// Componente de paginación
const Pagination = ({
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) => {

  const containerRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(true);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const threshold = 1000;
        setShowDetails(entry.contentRect.width > threshold);
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center p-2 ${showDetails ? 'justify-between' : 'justify-center'}`}
    >
      <div className="flex gap-3 items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="text-sm font-medium"
        >
          Anterior
        </button>
        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="text-sm font-medium"
        >
          Siguiente
        </button>
      </div>
      {showDetails && (
        <div>
          <small>
            Mostrando {pageSize} elementos por página, de un total de {totalItems}{' '}
            elementos
          </small>
        </div>
      )}      
    </div>
  );
};

type Column = {
  title: string;
  key: string;
  render?: (item: any) => React.ReactNode; // Para personalizar el contenido de la celda
};

type Action = {
  label: string;
  onClick: (item: any) => void; // Función que se ejecutará al hacer clic
};

type TableProps = {
  columns: Column[];
  data: any[]; // Aquí puedes definir el tipo específico que esperas
  actions?: Action[]; // Acciones opcionales
  paginationEnabled?: boolean; // Habilitar o deshabilitar la paginación
  paginationProps?: any; // Propiedades de la paginación
  loading?: boolean; // Estado de carga opcional
  noDataMessage?: string; // Mensaje a mostrar si no hay datos
};

const Table = ({ 
  columns, 
  data, 
  actions, 
  paginationEnabled, 
  paginationProps, 
  loading = false,
  noDataMessage = 'No hay datos disponibles',
}: TableProps) => {
    const { currentPage = 0, pageSize = 10, totalPages = 1, totalItems = 10, onPageChange } =
      paginationProps || {};
  return(
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="min-w-[100px] py-2 px-3 font-medium text-sm text-black dark:text-white"
                >
                  {column.title}
                </th>
              ))}
              {actions && (
                <th className="py-2 px-3 font-medium text-black dark:text-white">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            { loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-6 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5 border-b-2 border-primary dark:border-white rounded-full"
                      viewBox="0 0 24 24"
                    ></svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Cargando datos...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-6 text-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {noDataMessage}
                  </span>
                </td>
              </tr>
            ) : (
                data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="border-b border-[#eee] py-2 px-3 text-sm dark:border-strokedark"
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="border-b border-[#eee] py-3 px-3 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className="hover:text-primary"
                            onClick={() => action.onClick(item)}
                          >
                            {action.label == 'View' && (
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                  fill=""
                                />
                                <path
                                  d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                  fill=""
                                />
                              </svg>
                            )}
                            {action.label == 'Delete' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24">
                                  <path fill="currentColor" 
                                  d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/>
                              </svg>
                            )}
                            {action.label == 'Download' && (
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                  fill=""
                                />
                                <path
                                  d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                                  fill=""
                                />
                              </svg>
                            )}
                            {action.label == 'Edit' && (
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 25 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M2.70796 3.87868C3.27057 3.31607 4.03363 3 4.82928 3H11.8293C12.3816 3 12.8293 3.44772 12.8293 4C12.8293 4.55228 12.3816 5 11.8293 5H4.82928C4.56407 5 4.30971 5.10536 4.12218 5.29289C3.93464 5.48043 3.82928 5.73478 3.82928 6V20C3.82928 20.2652 3.93464 20.5196 4.12218 20.7071C4.30971 20.8946 4.56407 21 4.82928 21H18.8293C19.0945 21 19.3489 20.8946 19.5364 20.7071C19.7239 20.5196 19.8293 20.2652 19.8293 20V13C19.8293 12.4477 20.277 12 20.8293 12C21.3816 12 21.8293 12.4477 21.8293 13V20C21.8293 20.7956 21.5132 21.5587 20.9506 22.1213C20.388 22.6839 19.6249 23 18.8293 23H4.82928C4.03363 23 3.27057 22.6839 2.70796 22.1213C2.14536 21.5587 1.82928 20.7956 1.82928 20V6C1.82928 5.20435 2.14535 4.44129 2.70796 3.87868Z"
                                    fill=""
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M20.8293 2.87866C20.5319 2.87866 20.2467 2.9968 20.0364 3.20709L10.7323 12.5112L10.2037 14.6256L12.3181 14.097L21.6222 4.79288C21.8325 4.58259 21.9506 4.29737 21.9506 3.99998C21.9506 3.70259 21.8325 3.41738 21.6222 3.20709C21.4119 2.9968 21.1267 2.87866 20.8293 2.87866ZM18.6222 1.79288C19.2076 1.20751 20.0015 0.878662 20.8293 0.878662C21.6571 0.878662 22.4511 1.20751 23.0364 1.79288C23.6218 2.37824 23.9506 3.17216 23.9506 3.99998C23.9506 4.82781 23.6218 5.62173 23.0364 6.20709L13.5364 15.7071C13.4083 15.8352 13.2477 15.9262 13.0718 15.9701L9.07184 16.9701C8.73107 17.0553 8.37058 16.9555 8.1222 16.7071C7.87382 16.4587 7.77397 16.0982 7.85916 15.7574L8.85916 11.7574C8.90312 11.5816 8.99404 11.421 9.1222 11.2929L18.6222 1.79288Z"
                                    fill=""
                                  />
                                </g>
                              </svg>
                            )}
                            {action.label == 'Activate' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M21.5 9h-5l1.86-1.86A7.99 7.99 0 0 0 12 4c-4.42 0-8 3.58-8 8c0 1.83.61 3.5 1.64 4.85c1.22-1.4 3.51-2.35 6.36-2.35s5.15.95 6.36 2.35A7.95 7.95 0 0 0 20 12h2c0 5.5-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2c3.14 0 5.95 1.45 7.78 3.72L21.5 4zM12 20c1.9 0 3.64-.66 5-1.76c-.64-1.01-2.55-1.74-5-1.74s-4.36.73-5 1.74c1.36 1.1 3.1 1.76 5 1.76m0-14c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 2c-.83 0-1.5.67-1.5 1.5S11.17 11 12 11s1.5-.67 1.5-1.5S12.83 8 12 8"/>
                                </svg>
                            )}
                            {action.label == 'Evaluation' && (
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 25 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_148_330)">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.82928 4.5H18.8293C20.4206 4.5 21.9467 5.13214 23.0719 6.25736C24.1971 7.38258 24.8293 8.9087 24.8293 10.5V15C24.8293 16.5913 24.1971 18.1174 23.0719 19.2426C21.9467 20.3679 20.4206 21 18.8293 21H6.82928C5.23799 21 3.71186 20.3679 2.58664 19.2426C1.46143 18.1174 0.829285 16.5913 0.829285 15V10.5C0.829285 8.9087 1.46143 7.38258 2.58664 6.25736C3.71186 5.13214 5.23799 4.5 6.82928 4.5ZM6.82928 6C5.63581 6 4.49122 6.47411 3.6473 7.31802C2.80339 8.16193 2.32928 9.30653 2.32928 10.5V15C2.32928 16.1935 2.80339 17.3381 3.6473 18.182C4.49122 19.0259 5.63581 19.5 6.82928 19.5H18.8293C20.0228 19.5 21.1674 19.0259 22.0113 18.182C22.8552 17.3381 23.3293 16.1935 23.3293 15V10.5C23.3293 9.30653 22.8552 8.16193 22.0113 7.31802C21.1674 6.47411 20.0228 6 18.8293 6H6.82928Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.07928 9C8.88037 9 8.68961 9.07902 8.54895 9.21967C8.4083 9.36032 8.32928 9.55109 8.32928 9.75V12H6.07928C5.88037 12 5.68961 12.079 5.54895 12.2197C5.4083 12.3603 5.32928 12.5511 5.32928 12.75C5.32928 12.9489 5.4083 13.1397 5.54895 13.2803C5.68961 13.421 5.88037 13.5 6.07928 13.5H8.32928V15.75C8.32928 15.9489 8.4083 16.1397 8.54895 16.2803C8.68961 16.421 8.88037 16.5 9.07928 16.5C9.2782 16.5 9.46896 16.421 9.60961 16.2803C9.75027 16.1397 9.82928 15.9489 9.82928 15.75V13.5H12.0793C12.2782 13.5 12.469 13.421 12.6096 13.2803C12.7503 13.1397 12.8293 12.9489 12.8293 12.75C12.8293 12.5511 12.7503 12.3603 12.6096 12.2197C12.469 12.079 12.2782 12 12.0793 12H9.82928V9.75C9.82928 9.55109 9.75027 9.36032 9.60961 9.21967C9.46896 9.07902 9.2782 9 9.07928 9ZM20.3293 10.5C20.3293 10.8978 20.1712 11.2794 19.8899 11.5607C19.6086 11.842 19.2271 12 18.8293 12C18.4315 12 18.0499 11.842 17.7686 11.5607C17.4873 11.2794 17.3293 10.8978 17.3293 10.5C17.3293 10.1022 17.4873 9.72064 17.7686 9.43934C18.0499 9.15804 18.4315 9 18.8293 9C19.2271 9 19.6086 9.15804 19.8899 9.43934C20.1712 9.72064 20.3293 10.1022 20.3293 10.5ZM18.8293 15C18.8293 15.3978 18.6712 15.7794 18.3899 16.0607C18.1086 16.342 17.7271 16.5 17.3293 16.5C16.9315 16.5 16.5499 16.342 16.2686 16.0607C15.9873 15.7794 15.8293 15.3978 15.8293 15C15.8293 14.6022 15.9873 14.2206 16.2686 13.9393C16.5499 13.658 16.9315 13.5 17.3293 13.5C17.7271 13.5 18.1086 13.658 18.3899 13.9393C18.6712 14.2206 18.8293 14.6022 18.8293 15Z"
                                    fill=""
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_148_330">
                                    <rect
                                      width="24"
                                      height="24"
                                      fill="currentColor"
                                      transform="translate(0.829285)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {paginationEnabled && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Table;
