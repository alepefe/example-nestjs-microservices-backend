import { Injectable, PipeTransform } from '@nestjs/common';
import { Criteria } from '../domain/criteria/criteria';

@Injectable()
export class ExtractCriteriaValidationPipe implements PipeTransform {
  public transform(input: any): Criteria {
    return Criteria.fromPrimitives(input);
  }
}
