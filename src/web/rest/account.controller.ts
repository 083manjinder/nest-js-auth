/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Param,
  Post,
  Res,
  UseGuards,
  Controller,
  Get,
  HttpCode,
  Logger,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard, Roles, RoleType, RolesGuard } from '../../security';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import { UserDTO } from '../../service/dto/user.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { AuthService } from '../../service/auth.service';

@Controller('api')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('account-resource')
export class AccountController {
  logger = new Logger('AccountController');

  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'Registered user',
    type: UserDTO,
  })
  async registerAccount(@Req() req: Request, @Body() userDTO: UserDTO & { password: string }): Promise<any> {
    return await this.authService.registerNewUser(userDTO);
  }

  @Get('/activate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Activate an account' })
  @ApiResponse({
    status: 200,
    description: 'activated',
  })
  activateAccount(@Param() key: string, @Res() res: Response): any {
    throw new InternalServerErrorException();
  }

  @Get('/authenticate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Check if the user is authenticated' })
  @ApiResponse({
    status: 200,
    description: 'login authenticated',
  })
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user.login;
  }

  @Get('/account')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user.' })
  @ApiResponse({
    status: 200,
    description: 'user retrieved',
  })
  async getAccount(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    const userProfileFound = await this.authService.getAccount(user.id);
    if (userProfileFound && !userProfileFound.firstName) {
      userProfileFound.firstName = '';
    }
    if (userProfileFound && !userProfileFound.lastName) {
      userProfileFound.lastName = '';
    }
    return userProfileFound;
  }

  @Post('/account')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the current user information' })
  @ApiResponse({
    status: 200,
    description: 'user info updated',
    type: UserDTO,
  })
  async saveAccount(@Req() req: Request, @Body() newUserInfo: UserDTO): Promise<any> {
    const user: any = req.user;
    return await this.authService.updateUserSettings(user.login, newUserInfo);
  }

  @Post('/account/change-password')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change current password' })
  @ApiResponse({
    status: 200,
    description: 'user password changed',
    type: PasswordChangeDTO,
  })
  async changePassword(@Req() req: Request, @Body() passwordChange: PasswordChangeDTO): Promise<any> {
    const user: any = req.user;
    return await this.authService.changePassword(user.login, passwordChange.currentPassword, passwordChange.newPassword);
  }

  @Post('/account/reset-password/init')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Send an email to reset the password of the user' })
  @ApiResponse({
    status: 201,
    description: 'mail to reset password sent',
    type: 'string',
  })
  requestPasswordReset(@Req() req: Request, @Body() email: string, @Res() res: Response): any {
    throw new InternalServerErrorException();
  }

  @Post('/account/reset-password/finish')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Finish to reset the password of the user' })
  @ApiResponse({
    status: 201,
    description: 'password reset',
    type: 'string',
  })
  finishPasswordReset(@Req() req: Request, @Body() keyAndPassword: string, @Res() res: Response): any {
    throw new InternalServerErrorException();
  }
}
