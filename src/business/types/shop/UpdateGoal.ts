import { IsPositive } from "class-validator";

export class UpdateGoal {
  @IsPositive()
  metaDoMes: number
}
