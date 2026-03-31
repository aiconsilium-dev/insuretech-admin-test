import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { ApiResponseDto } from '@/common/dto/api-response.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { ListDocumentsDto } from './dto/list-documents.dto';
import { DocumentListResponseDto } from './dto/documents-response.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // ─── Metadata ───────────────────────────────────────────────────────────────

  @Public()
  @Get('types')
  @ApiOperation({ summary: 'Get all document types with labels' })
  @ApiResponse({ status: 200, description: 'Document types retrieved successfully' })
  getDocTypes(): ApiResponseDto<{ value: string; label: string }[]> {
    return new ApiResponseDto(true, 'Document types retrieved successfully', this.documentsService.getDocTypes());
  }

  @Public()
  @Get('statuses')
  @ApiOperation({ summary: 'Get all document statuses with labels' })
  @ApiResponse({ status: 200, description: 'Document statuses retrieved successfully' })
  getDocStatuses(): ApiResponseDto<{ value: string; label: string }[]> {
    return new ApiResponseDto(true, 'Document statuses retrieved successfully', this.documentsService.getDocStatuses());
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get paginated list of documents with optional filters' })
  @ApiQuery({ name: 'claimId', required: false, type: String, description: 'Filter by claim ID' })
  @ApiQuery({ name: 'docType', required: false, enum: ['exemption_notice', 'litigation_brief', 'adjustment_opinion', 'civil_response'], description: 'Filter by document type' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully', type: DocumentListResponseDto })
  async findAll(@Query() dto: ListDocumentsDto): Promise<ApiResponseDto<DocumentListResponseDto['data']>> {
    const data = await this.documentsService.findAll(dto);
    return new ApiResponseDto(true, 'Documents retrieved successfully', data);
  }
}
