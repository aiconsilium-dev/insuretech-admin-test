import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocType, DocStatus } from './entity/document.entity';
import { ListDocumentsDto } from './dto/list-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async findAll(dto: ListDocumentsDto) {
    const { claimId, docType, page = 1, limit = 10 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.documentRepository
      .createQueryBuilder('document')
      .leftJoin('document.claim', 'claim')
      .leftJoin('claim.complex', 'complex')
      .select([
        'document.id',
        'document.claimId',
        'document.docType',
        'document.title',
        'document.status',
        'document.fileUrl',
        'document.createdAt',
        'claim.id',
        'complex.name',
      ])
      .where('document.deletedAt IS NULL');

    if (claimId) {
      qb.andWhere('document.claimId = :claimId', { claimId });
    }

    if (docType) {
      qb.andWhere('document.docType = :docType', { docType });
    }

    const [rawItems, totalCount] = await qb
      .orderBy('document.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = rawItems.map((doc) => ({
      id: doc.id,
      claimId: doc.claimId,
      docType: doc.docType,
      title: doc.title,
      status: doc.status,
      fileUrl: doc.fileUrl,
      complexName: (doc.claim as unknown as { complex?: { name: string } })?.complex?.name ?? null,
      createdAt: doc.createdAt,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return { items, totalCount, page, totalPages };
  }

  // ─── Metadata ───────────────────────────────────────────────────────────────

  /** Returns all possible document types with human-readable labels. */
  getDocTypes(): { value: string; label: string }[] {
    return [
      { value: DocType.EXEMPTION_NOTICE,   label: '면책 통보서' },
      { value: DocType.LITIGATION_BRIEF,   label: '소송 의견서' },
      { value: DocType.ADJUSTMENT_OPINION, label: '손해사정 의견서' },
      { value: DocType.CIVIL_RESPONSE,     label: '민원 답변서' },
    ];
  }

  /** Returns all possible document statuses with human-readable labels. */
  getDocStatuses(): { value: string; label: string }[] {
    return [
      { value: DocStatus.DRAFT,    label: '초안' },
      { value: DocStatus.WAIT,     label: '검토 대기' },
      { value: DocStatus.DONE,     label: '완료' },
      { value: DocStatus.TRANSFER, label: '이관' },
    ];
  }
}
