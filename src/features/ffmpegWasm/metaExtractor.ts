
interface Extractor extends Array<number> {
  0: number;
  1: number;
  2: number;
}

const metaExtractor = async (_url: string): Promise<Extractor> => {
   //TODO

  return [0, 0, 0];
};

export { metaExtractor };
