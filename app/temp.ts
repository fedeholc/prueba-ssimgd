type webSerie = {
  name: string;
  url: string;
  subpages: {

  }
}

const temp1 = {
  name: "bla",
  url: "https://www.bla.com",
  subpages: {
    bla1: ["https://www.bla.com/bla1.jpg", "https://www.bla.com/bla1.jpg"],
    bla2: ["https://www.bla.com/bla2"],
    bla3: ["https://www.bla.com/bla3"],
  }
}

const temp2 = {
  name: "bla",
  url: "https://www.bla.com",
  pages: [
    {
      url: "https://www.bla.com/bla1",
      images: ["https://www.bla.com/bla1/image1",
        "https://www.bla.com/bla1/image2"]
    },
    {
      urlsubpage: "https://www.bla.com/bla2",
      images: ["https://www.bla.com/bla2/image1",
        "https://www.bla.com/bla2/image2"]
    },
  ],
  filters: []
}
