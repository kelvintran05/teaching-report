export type ParsedSheet = {
  sheets: string[];
  headerRowIdx: number;
  header: string[];
  mapping: Record<string,string>;
  preview: Record<string, string | number | null>[];
  count: number;
};
