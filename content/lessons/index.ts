import type { Lesson } from "../../shared/types";
import { FOUNDATION_LESSONS } from "./foundations";
import { CLINICAL_LESSONS } from "./clinical";

export const LESSONS: Lesson[] = [...FOUNDATION_LESSONS, ...CLINICAL_LESSONS];

export const LESSON_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));
