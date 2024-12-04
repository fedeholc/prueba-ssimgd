import { JSDOM } from "jsdom";

async function getSubPages(pageUrl: string): Promise<Set<string> | undefined> {
  try {
    const response = await fetch(pageUrl);
    const html = await response.text();

    // get subpages using jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const subPages = new Set<string>();
    const links = document.querySelectorAll("a");
    console.log("Subpaginas:", links)
    links.forEach((link) => {
      const href = link.getAttribute("href");
      //TODO: qué pasa si no existe subPageMustInclude?? y si lo quiero hacer un array para checkiar varias cosas?
      if (href) {
        subPages.add(href);
        console.log("Agregada:", href);
      }
    });
    return subPages;
  } catch (err) {
    console.error(`Error getting subpages from ${pageUrl}: ${err}`);
    return;
  }
}

async function getImagesUrls(pageUrl: string, sourceUrl: string): Promise<string[] | undefined> {
  try {
     const response = await fetch(pageUrl);
    const html = await response.text();


    const dom = new JSDOM(html);
    const document = dom.window.document;
    const uniqueImgUrls = new Set<string>();
    const imgs = document.querySelectorAll("img");

    imgs.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        uniqueImgUrls.add(src);
      }


      //busca imagenes tambien en srcset
      const srcSet = img.getAttribute('srcset');
      if (srcSet) {
        const srcArray = srcSet.split(",");
        const srcArray2 = srcArray.map((item) => {
          return item.trim().split(" ")[0];
        });

        srcArray2.forEach(element => uniqueImgUrls.add(element));
      }
    });


    //incluí también imagenes que vienen en links
    const aimgs = document.querySelectorAll("a");
    aimgs.forEach((aimg) => {
      let hrefs = aimg.getAttribute("href");
      if (hrefs && !hrefs.startsWith("http")) {
        const url = new URL(sourceUrl);
        hrefs = url.origin + hrefs;
      }

      if (hrefs) {
        if (hrefs.endsWith(".jpg") || hrefs.endsWith(".jpeg") || hrefs.endsWith(".png") || hrefs.endsWith(".gif")) {

          uniqueImgUrls.add(hrefs);
        }
      }
    });

    console.log("Unique Images:", uniqueImgUrls.size);

    return Array.from(uniqueImgUrls);
  } catch {
    console.error(`Error processing page ${pageUrl}`);
  }
}

async function getImages(pages: Set<string>, sourceUrl: string): Promise<string[] | undefined> {
  if (!pages) {
    return;
  }
  const imagesList: Set<string> = new Set();

  //TODO: acá tendría que checkiar si hay que leer los links de la página o si hacerlo desde un archivo aparte o desde otra variable del mismo json, de lo generado a partir de playwright. y al final llamar a downloadImages con la lista de links.

     console.log("Pages:", pages)
    for (let page of pages) {
      //VER Sería para resolver URLs relativas, pero no lo probé aún
      if (page && !page.startsWith("http")) {
        const url = new URL(sourceUrl);
        page = url.origin + page;
      }

      // Evitar URLs vacías y anclas
      if (page && !page.startsWith("#")) {
        console.log(`Procesando: ${page}`);
        const urls = await getImagesUrls(page, sourceUrl);
        if (urls) {
          urls.forEach(element => imagesList.add(element));
        }
      }
    }
  

  if (imagesList.size === 0) {
    console.error("No images found");
    return;
  }
  //const downloadedLinks = await downloadImages(Array.from(imagesList));
  return Array.from(imagesList);
}

export async function GET() {
  const rta = await getSubPages("https://www.google.com");
  console.log("rta:", rta);
  return Response.json({ message: "Hola", rta: Array.from(rta as Set<string>) });
}

export async function POST(request: Request) {
  const { url } = await request.json();
  const subPages = await getSubPages(url);
  console.log("subpages:", subPages);

  let downloadedLinks: string[] | undefined = [];


  if (subPages && subPages.size > 0) {
    subPages.add(url);
    console.log("busco con subp:", subPages);
    downloadedLinks = await getImages(subPages, url);
  } else {
    console.log("busco sin subp:", url);
    const page = new Set<string>();
    page.add(url);
    downloadedLinks = await getImages(page, url);
  }

  console.log("images links", downloadedLinks)



  return Response.json({ message: "Hola", rta: downloadedLinks });
}