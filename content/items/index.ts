import type { AssessmentItem } from "../../shared/types";
import { PLACEMENT_ITEMS, SCREENING_IDS } from "./placement";
import { LESSON_ITEMS } from "./lessonItems";

export { SCREENING_IDS };

export const ITEMS: AssessmentItem[] = [...PLACEMENT_ITEMS, ...LESSON_ITEMS];

export const ITEM_BY_ID = new Map(ITEMS.map((i) => [i.id, i]));
