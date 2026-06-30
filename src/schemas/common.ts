import { z } from 'zod';

export const isoDateTimeStringSchema = z.iso.datetime({ offset: true });

export const nonEmptyTrimmedStringSchema = z.string().trim().min(1);

export const stringListSchema = z.array(nonEmptyTrimmedStringSchema);

export const languageCodeSchema = z.string().trim().min(2).max(10);
