export interface LessonDocument {
  lessonId: string; // Referencia canónica al ID en COURSE_CONFIG (ej. 'c1')
  sections: LessonSection[];
}

export interface LessonSection {
  id: string; // Ancla semántica para la sección (ej. 'mental-model')
  title: string;
  subtitle?: string;
  blocks: LessonBlock[];
}

export type LessonBlock =
  | ParagraphBlock
  | CalloutBlock
  | ComparisonBlock
  | CodeBlock
  | KeyInsightsBlock
  | ExampleBlock
  | DemoRefBlock
  | LabRefBlock;

export interface ParagraphBlock {
  type: 'PARAGRAPH';
  text: string;
  lead?: boolean;
}

export type CalloutVariant = 'rule' | 'info' | 'warning' | 'caution';

export interface CalloutBlock {
  type: 'CALLOUT';
  variant: CalloutVariant;
  title?: string;
  message: string;
}

export interface ComparisonColumn {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  points: string[];
  active?: boolean;
}

export interface ComparisonBlock {
  type: 'COMPARISON';
  left: ComparisonColumn;
  right: ComparisonColumn;
}

export interface CodeBlock {
  type: 'CODE';
  code: string;
  language: string;
  filename?: string;
  description?: string;
  lineNumbers?: boolean;
}

export interface KeyInsightsBlock {
  type: 'KEY_INSIGHTS';
  title?: string;
  items: string[];
}

export interface ExampleBlock {
  type: 'EXAMPLE';
  title?: string;
  content: string | string[];
  caption?: string;
}

export interface DemoRefBlock {
  type: 'DEMO_REF';
  demoId: string;
  title: string;
  description: string;
  path: string;
  actionLabel?: string;
}

export interface LabRefBlock {
  type: 'LAB_REF';
  labId: string;
  title: string;
  description: string;
  path: string;
  duration?: string;
  actionLabel?: string;
}
