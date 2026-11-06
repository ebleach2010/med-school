// Hidden case state. Imported by the server only; never by client code.
import type { CaseDef } from "../../shared/types";
import { FULL_CASES } from "./full";
import { SPEED_CASES } from "./speed";

export const CASES: CaseDef[] = [...FULL_CASES, ...SPEED_CASES];

export const CASE_BY_ID = new Map(CASES.map((c) => [c.id, c]));
