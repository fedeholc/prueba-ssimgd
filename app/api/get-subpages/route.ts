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


export async function POST(request: Request) {
  const { url } = await request.json();
  const subPages = await getSubPages(url);
  console.log("subpages:", subPages);



  return Response.json({ subPages: Array.from(subPages!) });
}