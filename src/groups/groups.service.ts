import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Group } from "./groups.model";
import { CreateGroupsDto } from "./dto/create-groups.dto";
import { JwtService } from "@nestjs/jwt";
import { Op } from "sequelize";


@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group) private groupRepository: typeof Group,
              private jwtService: JwtService) {
  }

  async create(dto: CreateGroupsDto, request: Request) {
    const token = request.headers['authorization'];

    const group = await this.groupRepository.findOne({ where: { guid: dto.guid } });

    if (!group) {
      await this.groupRepository.create(dto);
    } else {
      await this.groupRepository.update(dto, { where: { guid: dto.guid } })
    }
    throw new HttpException({ message: "Группа успешно создана" }, HttpStatus.OK);
  }

  async getAll() {
    const group = await this.groupRepository.findAll({
      where: {
        guid: {
          [Op.ne]: "00000000-0000-0000-0000-000000000000"
        }
      }
    });
    return group;
  }

  async getOne(id: number) {
    const group = await this.groupRepository.findOne({ where: { id } })
    if (!group) {
      throw new HttpException({ message: `Группы с id=${id} не найдено` }, HttpStatus.BAD_REQUEST)
    }
    return group;
  }

  async delete(id: number) {
    const group = await this.groupRepository.findOne({ where: { id } })

    if (!group) {
      throw new HttpException({ message: `Группы с id=${id} не найдено` }, HttpStatus.BAD_REQUEST)
    } else {
      await this.groupRepository.destroy({ where: { id } })
    }

    throw new HttpException({ message: `Группа успешно удалена` }, HttpStatus.OK)
  }
}
