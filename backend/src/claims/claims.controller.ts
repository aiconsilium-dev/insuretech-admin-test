import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { ApiResponseDto } from '@/common/dto/api-response.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { User } from '@/users/entity/user.entity';
import { ListClaimsDto } from './dto/list-claims.dto';
import { UpdateEstimationItemDto } from './dto/update-estimation-item.dto';
import { CreateApprovalDto } from './dto/create-approval.dto';
import {
  ClaimListResponseDto,
  ClaimDetailResponseDto,
  EstimationResponseDto,
  ApprovalResponseDto,
} from './dto/claims-response.dto';

@ApiTags('Claims')
@ApiBearerAuth()
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  // ─── Metadata ───────────────────────────────────────────────────────────────

  @Public()
  @Get('types')
  @ApiOperation({ summary: 'Get all claim types with labels' })
  @ApiResponse({ status: 200, description: 'Claim types retrieved successfully' })
  getClaimTypes(): ApiResponseDto<{ value: string; label: string }[]> {
    return new ApiResponseDto(true, 'Claim types retrieved successfully', this.claimsService.getClaimTypes());
  }

  @Public()
  @Get('statuses')
  @ApiOperation({ summary: 'Get all claim statuses with labels' })
  @ApiResponse({ status: 200, description: 'Claim statuses retrieved successfully' })
  getClaimStatuses(): ApiResponseDto<{ value: string; label: string }[]> {
    return new ApiResponseDto(true, 'Claim statuses retrieved successfully', this.claimsService.getClaimStatuses());
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get paginated list of claims with optional filters' })
  @ApiQuery({ name: 'type', required: false, enum: ['A', 'B', 'C'], description: 'Filter by claim type' })
  @ApiQuery({ name: 'status', required: false, enum: ['wait', 'done', 'sent', 'transfer', 'paid'], description: 'Filter by claim status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by complex name, claim id, or description' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Claims retrieved successfully', type: ClaimListResponseDto })
  async findAll(@Query() dto: ListClaimsDto): Promise<ApiResponseDto<ClaimListResponseDto['data']>> {
    const data = await this.claimsService.findAll(dto);
    return new ApiResponseDto(true, 'Claims retrieved successfully', data);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get claim detail by ID including photos, AI reasons, events, and type-specific details' })
  @ApiParam({ name: 'id', type: String, description: 'Claim ID' })
  @ApiResponse({ status: 200, description: 'Claim retrieved successfully', type: ClaimDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<ClaimDetailResponseDto['data']>> {
    const data = await this.claimsService.findOne(id);
    return new ApiResponseDto(true, 'Claim retrieved successfully', data);
  }

  @Public()
  @Get(':id/estimation')
  @ApiOperation({ summary: 'Get estimation with items for a specific claim' })
  @ApiParam({ name: 'id', type: String, description: 'Claim ID' })
  @ApiResponse({ status: 200, description: 'Estimation retrieved successfully', type: EstimationResponseDto })
  @ApiResponse({ status: 404, description: 'Estimation not found' })
  async getEstimation(@Param('id') id: string): Promise<ApiResponseDto<unknown>> {
    const data = await this.claimsService.findEstimation(id);
    return new ApiResponseDto(true, 'Estimation retrieved successfully', data);
  }

  @Patch(':id/estimation/items/:itemId')
  @ApiOperation({ summary: 'Update isSelected status of an estimation item' })
  @ApiParam({ name: 'id', type: String, description: 'Claim ID' })
  @ApiParam({ name: 'itemId', type: Number, description: 'Estimation item ID' })
  @ApiBody({ type: UpdateEstimationItemDto })
  @ApiResponse({ status: 200, description: 'Estimation item updated successfully' })
  @ApiResponse({ status: 404, description: 'Claim or estimation item not found' })
  async updateEstimationItem(
    @Param('id') id: string,
    @Param('itemId') itemId: number,
    @Body() dto: UpdateEstimationItemDto,
  ): Promise<ApiResponseDto<{ id: number; isSelected: boolean }>> {
    const data = await this.claimsService.updateEstimationItem(id, itemId, dto);
    return new ApiResponseDto(true, 'Estimation item updated successfully', data);
  }

  @Post(':id/approvals')
  @ApiOperation({ summary: 'Create an approval decision for a claim' })
  @ApiParam({ name: 'id', type: String, description: 'Claim ID' })
  @ApiBody({ type: CreateApprovalDto })
  @ApiResponse({ status: 201, description: 'Approval created successfully', type: ApprovalResponseDto })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  async createApproval(
    @Param('id') id: string,
    @Body() dto: CreateApprovalDto,
    @CurrentUser() user: User,
  ): Promise<ApiResponseDto<unknown>> {
    const data = await this.claimsService.createApproval(id, dto, user);
    return new ApiResponseDto(true, 'Approval created successfully', data);
  }
}
