import { parse } from 'csv-parse';

export function readCSVFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parser = parse();

      parser.on('readable', () => {
        const data: string[][] = [];
        let record;
        while ((record = parser.read())) {
          data.push(record);
        }

        resolve(data);
      });

      parser.write(reader.result?.toString());
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
