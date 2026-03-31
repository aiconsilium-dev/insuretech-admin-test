import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

/**
 * Common pagination query parameters.
 * Extend this class instead of repeating page/limit in each list DTO.
 *
 * NOTE: PageOptionsDto has been merged into this class.
 *       `src/common/dto/page-options.dto.ts` re-exports this class for
 *       backward compatibility — do not delete that file yet.
 */
export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', type: Number, default: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', type: Number, default: 10, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  /** When false, pagination is disabled and all records are returned. */
  @ApiPropertyOptional({
    description: 'Enable pagination (set false to return all records)',
    default: true,
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  readonly pagination?: boolean = true;
}

/** @deprecated Use PaginationDto directly. */
export { PaginationDto as PageOptionsDto };
