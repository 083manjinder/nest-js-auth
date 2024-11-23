import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TransactionDTO } from '../../service/dto/transaction.dto';
import { TransactionService } from '../../service/transaction.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('transactions')
export class TransactionController {
  logger = new Logger('TransactionController');

  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TransactionDTO,
  })
  async getAll(@Req() req: Request): Promise<TransactionDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.transactionService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      // order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TransactionDTO,
  })
  async getOne(@Param('id') id: string): Promise<TransactionDTO> {
    return await this.transactionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TransactionDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() transactionDTO: TransactionDTO): Promise<TransactionDTO> {
    const created = await this.transactionService.save(transactionDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Transaction', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TransactionDTO,
  })
  async put(@Req() req: Request, @Body() transactionDTO: TransactionDTO): Promise<TransactionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Transaction', transactionDTO.id);
    return await this.transactionService.update(transactionDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update transaction with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TransactionDTO,
  })
  async putId(@Req() req: Request, @Body() transactionDTO: TransactionDTO): Promise<TransactionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Transaction', transactionDTO.id);
    return await this.transactionService.update(transactionDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Transaction', id);
    return await this.transactionService.deleteById(id);
  }
}
