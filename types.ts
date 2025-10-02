
export interface KFactorVariable {
  key: string;
  name: string;
  description: string;
}

export interface KFactorDetail {
  id: string;
  name: string;
  description: string;
  formulaString: string;
  variables: KFactorVariable[];
  coefficients: { [key: string]: number };
  constant: number;
}

export interface KFactorGroup {
    id: string;
    name: string;
    factors: KFactorDetail[];
}
