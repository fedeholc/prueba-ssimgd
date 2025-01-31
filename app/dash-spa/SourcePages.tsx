/* eslint-disable @next/next/no-img-element */

export default function SourcePages({ pages }: { pages: Page[] }) {
  return (
    <div>
      {pages.map((page, index) => (
        <details key={`${page.url}${index}`}>
          <summary>
            {page.url} - {page.images?.length || 0} images
          </summary>

          <div className="img-grid">
            {page.images?.length === 0 && <div>No hay imágenes</div>}
            {page.images?.map((image: string, index: number) => (
              <div key={image}>
                <a href={image} target="_blank" rel="noopener noreferrer">
                  {image}
                </a>
                <img
                  style={{ maxHeight: "200px" }}
                  src={image}
                  alt={`Imagen ${index}`}
                />
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
