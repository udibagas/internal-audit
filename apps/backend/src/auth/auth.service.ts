import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { Login, Register } from "@audit-system/shared";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        role: true,
        department: true,
      },
    });

    if (
      user &&
      user.isActive &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: Login) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      departmentId: user.departmentId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: Register) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { name: registerDto.name }],
      },
    });

    if (existingUser) {
      throw new UnauthorizedException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        roleId: registerDto.roleId,
        departmentId: registerDto.departmentId,
      },
      include: {
        role: true,
        department: true,
      },
    });

    const { password: _, ...userResult } = user;

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      departmentId: user.departmentId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: userResult,
    };
  }
}
