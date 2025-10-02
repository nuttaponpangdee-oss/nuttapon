
import { KFactorGroup, KFactorVariable } from './types';

const VARIABLES: { [key: string]: KFactorVariable } = {
  I: { key: 'I', name: 'เหล็กและผลิตภัณฑ์เหล็ก', description: 'ดัชนีราคาผู้ผลิตหมวดเหล็กและผลิตภัณฑ์เหล็ก' },
  C: { key: 'C', name: 'ซีเมนต์', description: 'ดัชนีราคาผู้ผลิตหมวดซีเมนต์' },
  M: { key: 'M', name: 'วัสดุก่อสร้าง', description: 'ดัชนีราคาผู้ผลิตหมวดวัสดุก่อสร้าง (ไม่รวมเหล็กและซีเมนต์)' },
  S: { key: 'S', name: 'เหล็กเส้น', description: 'ดัชนีราคาผู้ผลิตหมวดเหล็กเส้น' },
  E: { key: 'E', name: 'เครื่องจักรกล', description: 'ดัชนีราคาผู้ผลิตหมวดเครื่องจักรกลและอุปกรณ์' },
  F: { key: 'F', name: 'Factor F', description: 'ดัชนีราคา Factor F (ค่าน้ำมัน, ค่าแรง, ค่าดำเนินการ)' },
  A: { key: 'A', name: 'ยางมะตอย (Asphalt)', description: 'ดัชนีราคายางมะตอย' },
  G: { key: 'G', name: 'เหล็กโครงสร้าง', description: 'ดัชนีราคาเหล็กโครงสร้าง' },
  PVC: { key: 'PVC', name: 'ท่อ PVC', description: 'ดัชนีราคาท่อและอุปกรณ์ PVC' },
};

export const K_FACTOR_GROUPS: KFactorGroup[] = [
  {
    id: 'K1',
    name: 'หมวดงานอาคาร',
    factors: [
      {
        id: 'K1',
        name: 'งานอาคารทั่วไป',
        description: 'งานอาคารทั่วไป (รวมงานโครงสร้าง, สถาปัตย์, และระบบในอาคาร)',
        formulaString: 'K = 0.25 + 0.15(It/Io) + 0.10(Ct/Co) + 0.40(Mt/Mo) + 0.10(St/So)',
        constant: 0.25,
        variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S],
        coefficients: { I: 0.15, C: 0.10, M: 0.40, S: 0.10 },
      },
    ],
  },
  {
    id: 'K2',
    name: 'หมวดงานดิน',
    factors: [
      {
        id: 'K2.1',
        name: 'งานดิน',
        description: 'งานดิน (ขุด, ตัก, บดอัดดิน, Embankment)',
        formulaString: 'K = 0.30 + 0.10(It/Io) + 0.40(Et/Eo) + 0.20(Ft/Fo)',
        constant: 0.30,
        variables: [VARIABLES.I, VARIABLES.E, VARIABLES.F],
        coefficients: { I: 0.10, E: 0.40, F: 0.20 },
      },
      {
        id: 'K2.2',
        name: 'งานหินเรียง',
        description: 'สำหรับงานก่อสร้างที่เกี่ยวข้องกับการเรียงหิน',
        formulaString: 'K = 0.40 + 0.20(It/Io) + 0.20(Mt/Mo) + 0.20(Ft/Fo)',
        constant: 0.40,
        variables: [VARIABLES.I, VARIABLES.M, VARIABLES.F],
        coefficients: { I: 0.20, M: 0.20, F: 0.20 },
      },
      {
        id: 'K2.3',
        name: 'งานเจาะระเบิดหิน',
        description: 'สำหรับงานที่ต้องมีการเจาะและระเบิดหิน',
        formulaString: 'K = 0.45 + 0.15(It/Io) + 0.10(Mt/Mo) + 0.20(Et/Eo) + 0.10(Ft/Fo)',
        constant: 0.45,
        variables: [VARIABLES.I, VARIABLES.M, VARIABLES.E, VARIABLES.F],
        coefficients: { I: 0.15, M: 0.10, E: 0.20, F: 0.10 },
      },
    ],
  },
  {
    id: 'K3',
    name: 'หมวดงานทาง',
    factors: [
        {
            id: 'K3.1', name: 'งานผิวทาง Prime Coat, Tack Coat, Seal Coat', description: '',
            formulaString: 'K = 0.30 + 0.40(At/Ao) + 0.20(Et/Eo) + 0.10(Ft/Fo)',
            constant: 0.30, variables: [VARIABLES.A, VARIABLES.E, VARIABLES.F], coefficients: { A: 0.40, E: 0.20, F: 0.10 }
        },
        {
            id: 'K3.2', name: 'งานผิวทาง Surface Treatment, Slurry Seal', description: '',
            formulaString: 'K = 0.30 + 0.10(Mt/Mo) + 0.30(At/Ao) + 0.20(Et/Eo) + 0.10(Ft/Fo)',
            constant: 0.30, variables: [VARIABLES.M, VARIABLES.A, VARIABLES.E, VARIABLES.F], coefficients: { M: 0.10, A: 0.30, E: 0.20, F: 0.10 }
        },
        {
            id: 'K3.3', name: 'งานผิวทาง Asphaltic Concrete (AC), Penetration Macadam (PM)', description: '',
            formulaString: 'K = 0.30 + 0.10(Mt/Mo) + 0.40(At/Ao) + 0.10(Et/Eo) + 0.10(Ft/Fo)',
            constant: 0.30, variables: [VARIABLES.M, VARIABLES.A, VARIABLES.E, VARIABLES.F], coefficients: { M: 0.10, A: 0.40, E: 0.10, F: 0.10 }
        },
        {
            id: 'K3.4', name: 'งานผิวถนนคอนกรีตเสริมเหล็ก (คสล.)', description: '',
            formulaString: 'K = 0.30 + 0.10(It/Io) + 0.35(Ct/Co) + 0.10(Mt/Mo) + 0.15(St/So)',
            constant: 0.30, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S], coefficients: { I: 0.10, C: 0.35, M: 0.10, S: 0.15 }
        },
        {
            id: 'K3.5', name: 'งานคูและบ่อพัก คสล.', description: '',
            formulaString: 'K = 0.35 + 0.20(It/Io) + 0.15(Ct/Co) + 0.15(Mt/Mo) + 0.15(St/So)',
            constant: 0.35, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S], coefficients: { I: 0.20, C: 0.15, M: 0.15, S: 0.15 }
        },
        {
            id: 'K3.6', name: 'งานสะพาน, เขื่อน, ท่าเรือ', description: '',
            formulaString: 'K = 0.30 + 0.10(It/Io) + 0.15(Ct/Co) + 0.20(Mt/Mo) + 0.25(St/So)',
            constant: 0.30, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S], coefficients: { I: 0.10, C: 0.15, M: 0.20, S: 0.25 }
        },
        {
            id: 'K3.7', name: 'งานโครงสร้างเหล็ก', description: '',
            formulaString: 'K = 0.25 + 0.10(It/Io) + 0.05(Ct/Co) + 0.20(Mt/Mo) + 0.40(St/So)',
            constant: 0.25, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S], coefficients: { I: 0.10, C: 0.05, M: 0.20, S: 0.40 }
        },
    ],
  },
  {
    id: 'K4',
    name: 'หมวดงานชลประทาน',
    factors: [
        {
            id: 'K4.1', name: 'งานอาคารชลประทาน (ไม่รวมบานเหล็ก)', description: '',
            formulaString: 'K = 0.40 + 0.20(It/Io) + 0.10(Ct/Co) + 0.10(Mt/Mo) + 0.20(St/So)',
            constant: 0.40, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S], coefficients: { I: 0.20, C: 0.10, M: 0.10, S: 0.20 }
        },
        {
            id: 'K4.3', name: 'งานบานเหล็ก (Trashrack, Steel Liner)', description: '',
            formulaString: 'K = 0.35 + 0.20(It/Io) + 0.45(Gt/Go)',
            constant: 0.35, variables: [VARIABLES.I, VARIABLES.G], coefficients: { I: 0.20, G: 0.45 }
        },
        {
            id: 'K4.5', name: 'งานคอนกรีต (ไม่รวมเหล็ก)', description: '',
            formulaString: 'K = 0.40 + 0.15(It/Io) + 0.25(Ct/Co) + 0.20(Mt/Mo)',
            constant: 0.40, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M], coefficients: { I: 0.15, C: 0.25, M: 0.20 }
        },
        {
            id: 'K4.7', name: 'งานอัดฉีดน้ำปูน (Grouting)', description: '',
            formulaString: 'K = 1.00(Ct/Co)',
            constant: 0, variables: [VARIABLES.C], coefficients: { C: 1.00 }
        },
    ]
  },
  {
    id: 'K5',
    name: 'หมวดงานระบบสาธารณูปโภค',
    factors: [
        {
            id: 'K5.1.1', name: 'งานรับวางท่อ AC และ PVC (ผู้ว่าจ้างจัดหาท่อ)', description: '',
            formulaString: 'K = 0.50 + 0.25(It/Io) + 0.25(Mt/Mo)',
            constant: 0.50, variables: [VARIABLES.I, VARIABLES.M], coefficients: { I: 0.25, M: 0.25 }
        },
        {
            id: 'K5.1.3', name: 'งานจัดหาและรับวางท่อ PVC', description: '',
            formulaString: 'K = 0.40 + 0.10(It/Io) + 0.10(Mt/Mo) + 0.40(PVCt/PVCo)',
            constant: 0.40, variables: [VARIABLES.I, VARIABLES.M, VARIABLES.PVC], coefficients: { I: 0.10, M: 0.10, PVC: 0.40 }
        },
        {
            id: 'K5.4', name: 'งานวางท่อ PVC หุ้มคอนกรีต', description: '',
            formulaString: 'K = 0.30 + 0.10(It/Io) + 0.20(Ct/Co) + 0.05(Mt/Mo) + 0.05(St/So) + 0.30(PVCt/PVCo)',
            constant: 0.30, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.M, VARIABLES.S, VARIABLES.PVC], coefficients: { I: 0.10, C: 0.20, M: 0.05, S: 0.05, PVC: 0.30 }
        },
        {
            id: 'K5.5', name: 'งานวางท่อ PVC กลบทราย', description: '',
            formulaString: 'K = 0.25 + 0.05(It/Io) + 0.05(Mt/Mo) + 0.65(PVCt/PVCo)',
            constant: 0.25, variables: [VARIABLES.I, VARIABLES.M, VARIABLES.PVC], coefficients: { I: 0.05, M: 0.05, PVC: 0.65 }
        },
        {
            id: 'K5.8.1', name: 'งานเสาเข็มคอนกรีตอัดแรง', description: '',
            formulaString: 'K = 0.35 + 0.15(It/Io) + 0.20(Ct/Co) + 0.30(St/So)',
            constant: 0.35, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.S], coefficients: { I: 0.15, C: 0.20, S: 0.30 }
        },
        {
            id: 'K5.8.2', name: 'งานเสาเข็ม Cast in Place', description: '',
            formulaString: 'K = 0.30 + 0.10(It/Io) + 0.25(Ct/Co) + 0.35(St/So)',
            constant: 0.30, variables: [VARIABLES.I, VARIABLES.C, VARIABLES.S], coefficients: { I: 0.10, C: 0.25, S: 0.35 }
        },
    ]
  }
];
