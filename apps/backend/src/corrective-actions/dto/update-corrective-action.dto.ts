import { PartialType } from "@nestjs/swagger";
import { CreateCorrectiveActionDto } from "./create-corrective-action.dto";

export class UpdateCorrectiveActionDto extends PartialType(
  CreateCorrectiveActionDto
) {}
