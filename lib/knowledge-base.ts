// lib/knowledge-base.ts
// 中润农垦食品集团有限公司 — 企业制度、技术规范、管理制度与外部法律法规知识库

import { KnowledgeDocument, DocCategory } from "@/types/fde";

export interface RuleChunk {
  id: string;
  docId: string;
  ruleName: string;
  category: DocCategory;
  clause: string;
  version: string;
  content: string;
  keywords: string[];
}

export const CATEGORY_DEFINITIONS: {
  category: DocCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    category: "INTERNAL_RULE",
    label: "企业内部规章制度",
    icon: "🏛️",
    description: "集团党委会、董事会批准下发的资金、招采、三重一大等重大治理规章"
  },
  {
    category: "TECH_STANDARD",
    label: "技术文件与标准",
    icon: "🔬",
    description: "食品加工生产规程、研发质控标准、冷链物联网传感器技术指引"
  },
  {
    category: "MGMT_NORM",
    label: "管理规范与细则",
    icon: "📑",
    description: "供应商考评、入库抽检验收、合同履约监控及责任追究实施细则"
  },
  {
    category: "EXTERNAL_LAW",
    label: "外部法律与国标",
    icon: "⚖️",
    description: "《食品安全法》、《民法典》合同编、国家强制性食品安全GB标准"
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  // 1. 企业内部规章制度
  {
    id: "DOC-INT-001",
    title: "《中润农垦集团大额资金支付与审批管理办法》",
    category: "INTERNAL_RULE",
    categoryLabel: "企业内部规章制度",
    docNo: "中润规字〔2025〕08号",
    version: "v2025.1 现行版",
    status: "ACTIVE",
    publishDate: "2025-01-15",
    issuingBody: "集团财务资产部 / 董事会审定",
    fileSize: "1.8 MB",
    chunkCount: 38,
    clausesCount: 42,
    summary: "规范集团总部及下属独资、控股食品加工企业单笔大额资金审批流程，确立超 100 万元款项必须前置上党委会/办公会‘三重一大’决策的刚性红线。",
    sampleClause: "第十四条：单笔合同总额达 100 万元及以上，必须前置附具党委会‘三重一大’决策纪要文号，未经前置审定财务一律不得付款。"
  },
  {
    id: "DOC-INT-002",
    title: "《中润农垦集团直采直供与战略招采协同细则》",
    category: "INTERNAL_RULE",
    categoryLabel: "企业内部规章制度",
    docNo: "中润招字〔2024〕22号",
    version: "v2.0 运行版",
    status: "ACTIVE",
    publishDate: "2024-06-20",
    issuingBody: "集团供应链管理中心",
    fileSize: "2.1 MB",
    chunkCount: 26,
    clausesCount: 35,
    summary: "界定源头原产地基地直采、鲜活生鲜冷链运输服务在入围合格承运商且未超过 50 万元时豁免公开招标的准入标准。",
    sampleClause: "第七条：年度 A 级合格承运商且单笔合同额不超过 50 万元的鲜活物流保供直签，经业务分管领导批示可免予公开招标。"
  },
  {
    id: "DOC-INT-003",
    title: "《中润农垦集团“三重一大”集体决策事项清单及实施办法》",
    category: "INTERNAL_RULE",
    categoryLabel: "企业内部规章制度",
    docNo: "中润党字〔2024〕03号",
    version: "v2024.3 修订版",
    status: "ACTIVE",
    publishDate: "2024-03-01",
    issuingBody: "集团党委办公室 / 纪检监察室",
    fileSize: "1.5 MB",
    chunkCount: 29,
    clausesCount: 28,
    summary: "严格规定重大决策、重要人事任免、重大项目安排和大额度资金运作的集体审议规则与责任终身追溯机制。",
    sampleClause: "第五条：大额物资采购、固定资产技改属于重大资金运作事项，严禁以化整为零方式规避集体决策。"
  },

  // 2. 技术文件与规范
  {
    id: "DOC-TECH-001",
    title: "《食用植物油精炼生产与原粮毛油验收技术操作规程》",
    category: "TECH_STANDARD",
    categoryLabel: "技术文件与标准",
    docNo: "ZR-TECH-2024-08",
    version: "v1.4 工艺版",
    status: "ACTIVE",
    publishDate: "2024-08-10",
    issuingBody: "第一食品加工厂生产技术部",
    fileSize: "4.2 MB",
    chunkCount: 45,
    clausesCount: 50,
    summary: "明确大豆原粮毛油在酸价、过氧化值、溶剂残留及水分杂质等理化指标上的收货标准，严禁不达标原粮进入精炼车间。",
    sampleClause: "第 3.2 条：浸出大豆毛油进厂须由品控实验室每车双盲抽检，GB 1535 指标不合格率大于 0.2% 立即退回整车。"
  },
  {
    id: "DOC-TECH-002",
    title: "《高活性复配食品添加剂与改良剂技术指标及配伍规范》",
    category: "TECH_STANDARD",
    categoryLabel: "技术文件与标准",
    docNo: "ZR-TECH-2025-01",
    version: "v2.0 研发版",
    status: "ACTIVE",
    publishDate: "2025-01-05",
    issuingBody: "食品工程研发中心 / 质保部",
    fileSize: "3.6 MB",
    chunkCount: 32,
    clausesCount: 36,
    summary: "规范面包、烘焙及面制品改良剂的微生物指标、纯度标准及禁用成分清单，规定添加剂入库批次合格率底线必须达 99.8%。",
    sampleClause: "第 4.1 条：复配添加剂供方必须出具国家认可之第三方 CMA/CNAS 检测报告，抽检批次合格率低于 99.8% 实行一票否决。"
  },
  {
    id: "DOC-TECH-003",
    title: "《原产地冷链运输车厢温湿度传感器布设及远程监控技术要求》",
    category: "TECH_STANDARD",
    categoryLabel: "技术文件与标准",
    docNo: "ZR-TECH-2024-12",
    version: "v1.1 运行版",
    status: "ACTIVE",
    publishDate: "2024-11-28",
    issuingBody: "数字化协同办公室 / 物流部",
    fileSize: "1.9 MB",
    chunkCount: 18,
    clausesCount: 22,
    summary: "明确冷藏车厢前、中、后三点温湿度传感器联网打卡的技术协议，限定生鲜果蔬全程温控 0℃~4℃ 且数据实时上传中台。",
    sampleClause: "第 2.4 条：承运车辆必须具备 4G/IoT 实时数据上传接口，温度超标超 1 小时自动判定履约考核扣款。"
  },

  // 3. 管理规范与细则
  {
    id: "DOC-MGMT-001",
    title: "《中润农垦集团食品原料与添加剂采购质量合规规范》",
    category: "MGMT_NORM",
    categoryLabel: "管理规范与细则",
    docNo: "中润质字〔2025〕04号",
    version: "v3.2 质安版",
    status: "ACTIVE",
    publishDate: "2025-02-01",
    issuingBody: "集团安全生产与食品质量安全委员会",
    fileSize: "2.8 MB",
    chunkCount: 52,
    clausesCount: 48,
    summary: "集团食品安全‘一把手工程’管理制度，明确下属加工厂食品原料质量红线、供方违约连带赔偿与全网食品召回追责制度。",
    sampleClause: "第九条：所有进入加工厂之食用添加剂，抽检合格率必须达 99.8% 以上，严禁约定 95% 低标准；违约方承担 30% 惩罚性违约金及召回连带责任。"
  },
  {
    id: "DOC-MGMT-002",
    title: "《中润农垦集团战略供应商履约评价与不良行为惩戒细则》",
    category: "MGMT_NORM",
    categoryLabel: "管理规范与细则",
    docNo: "中润采字〔2024〕19号",
    version: "v2.1 施行版",
    status: "ACTIVE",
    publishDate: "2024-05-18",
    issuingBody: "集团商务采购部",
    fileSize: "2.3 MB",
    chunkCount: 30,
    clausesCount: 34,
    summary: "建立供应商红黄牌警示、冻结准入及永久列入集团黑名单的准则，对故意虚报发票、质量弄虚作假供应商实施一票否决制。",
    sampleClause: "第十一条：供应商所供批次发生严重质量纠纷或提供虚假检验报告的，直接列入集团永久黑名单，三年内不得参与任何招采。"
  },

  // 4. 外部法律法规与国家标准
  {
    id: "DOC-LAW-001",
    title: "《中华人民共和国食品安全法》（最新修正版重点条款）",
    category: "EXTERNAL_LAW",
    categoryLabel: "外部法律与国标",
    docNo: "国家主席令第二十一号",
    version: "2024 现行法",
    status: "ACTIVE",
    publishDate: "2024-01-01",
    issuingBody: "全国人民代表大会常务委员会",
    fileSize: "3.1 MB",
    chunkCount: 68,
    clausesCount: 154,
    summary: "国家食品安全母法，严格界定食品生产经营者进货查验记录制度、食品添加剂合规使用标准及违反法律红线的惩罚性赔偿追偿权。",
    sampleClause: "第五十条：食品生产企业采购食品原料、食品添加剂，应当查验供货者的许可证和产品合格证明文件，不得采购不符合食品安全标准的原料。"
  },
  {
    id: "DOC-LAW-002",
    title: "《GB 2760-2024 食品安全国家标准 食品添加剂使用标准》",
    category: "EXTERNAL_LAW",
    categoryLabel: "外部法律与国标",
    docNo: "国家卫生健康委员会 / 市场监管总局 2024年第2号公告",
    version: "2024 强制性国标",
    status: "ACTIVE",
    publishDate: "2024-03-12",
    issuingBody: "国家卫健委 / 国家市场监管总局",
    fileSize: "8.5 MB",
    chunkCount: 120,
    clausesCount: 88,
    summary: "我国食品工业强制执行标准，严格规定食品添加剂的使用原则、允许使用的品种、使用范围及最大使用量或残留量。",
    sampleClause: "表 A.1：各类烘焙复配酶制剂与发酵品质改良剂的使用范围严格限定于允许目录内，严禁超范围、超限量使用。"
  },
  {
    id: "DOC-LAW-003",
    title: "《中华人民共和国民法典》（合同编·买卖合同重点司法条文）",
    category: "EXTERNAL_LAW",
    categoryLabel: "外部法律与国标",
    docNo: "国家主席令第四十五号",
    version: "现行法典",
    status: "ACTIVE",
    publishDate: "2021-01-01",
    issuingBody: "第十三届全国人民代表大会",
    fileSize: "5.4 MB",
    chunkCount: 95,
    clausesCount: 130,
    summary: "确立民商事合同买卖双方权利义务对等原则、买受人检验义务与异议期限、不符合质量要求的违约赔偿责任及司法管辖权。",
    sampleClause: "第五百八十五条：当事人约定的违约金低于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以增加。"
  }
];

export const ENTERPRISE_KNOWLEDGE_BASE: RuleChunk[] = [
  {
    id: "RULE-CAPITAL-001",
    docId: "DOC-INT-001",
    ruleName: "《中润农垦集团大额资金支付与审批管理办法》",
    category: "INTERNAL_RULE",
    clause: "第十四条【大额资金与三重一大前置】",
    version: "v2025.1 现行版",
    content: "单笔资金支付或合同金额达到或超过人民币 100 万元（含 100 万元）的非日常生产物资采购、重大设备技改类合同，必须前置附具集团党委会或总经理办公会“三重一大”集体决策会议纪要及决策文号，未附具前置决策纪要文号的，财务部门一律不得予以审批放行及排期付款。",
    keywords: ["100万", "大额资金", "三重一大", "党委会", "决策纪要", "审批放行"]
  },
  {
    id: "RULE-CAPITAL-002",
    docId: "DOC-INT-001",
    ruleName: "《中润农垦集团大额资金支付与审批管理办法》",
    category: "INTERNAL_RULE",
    clause: "第二十一条【票据审核与质保金比例】",
    version: "v2025.1 现行版",
    content: "原料、辅料与大宗物资采购合同的表单申报总金额，必须与后附供货明细清单、单价及数量计算乘积严格保持勾稽一致，误差金额必须为 0。初次合作供应商预付款比例不得超过 30%，合同必须设立不低于 5% 的质量保证金，质保期满且无品质争议方可结清。",
    keywords: ["总金额", "勾稽一致", "预付款", "30%", "质保金", "5%"]
  },
  {
    id: "RULE-FOOD-001",
    docId: "DOC-MGMT-001",
    ruleName: "《中润农垦集团食品原料与添加剂采购质量合规规范》",
    category: "MGMT_NORM",
    clause: "第九条【食品添加剂与改良剂入库质检红线】",
    version: "v3.2 质安版",
    content: "所有进入下属食品加工厂的食用添加剂、复配发酵改良剂及防腐剂，供需双方约定的入库抽检批次合格率必须达到 99.8% 以上，严禁在合同中约定采用 95% 等低标准或普通工业级标准验收。供方在每批次发货前必须附具具备 CMA 或 CNAS 资质认证的第三方权威检验检测报告，未附报告直接拒收。",
    keywords: ["食品添加剂", "改良剂", "合格率", "99.8%", "95%", "CMA", "CNAS", "拒收"]
  },
  {
    id: "RULE-FOOD-002",
    docId: "DOC-MGMT-001",
    category: "MGMT_NORM",
    ruleName: "《中润农垦集团食品原料与添加剂采购质量合规规范》",
    clause: "第十八条【质量违约追偿与食品召回责任】",
    version: "v3.2 质安版",
    content: "因供方原料或添加剂质量隐患、有害物质残留、配方掺杂等原因导致集团下属加工厂产品被行政处罚、客户索赔、停线整改或发生社会性食品召回事件的，供货方必须承担全部连带赔偿责任及合同总金额 30% 之惩罚性违约金，并永久列入集团供应商黑名单。",
    keywords: ["食品召回", "连带赔偿", "30%", "违约金", "黑名单", "质量隐患"]
  },
  {
    id: "RULE-PROC-001",
    docId: "DOC-INT-002",
    category: "INTERNAL_RULE",
    ruleName: "《中润农垦集团直采直供与战略招采协同细则》",
    clause: "第七条【原产地冷链与保供直采免招标标准】",
    version: "v2.0 运行版",
    content: "针对源头农产品基地直采、鲜活原料温控冷链运输等保供时效要求高（需在 24 小时内发出）的专项物流服务，只要承运方属于集团年度入围合格承运商名录，且单笔采购或服务合同总额不超过 50 万元（含 50 万元）的，经业务分管副总经理批准，可豁免公开招标，实行点对点快速直签直采。",
    keywords: ["冷链", "直采", "免招标", "50万", "合格承运商", "快速直签"]
  },
  {
    id: "RULE-PROC-002",
    docId: "DOC-INT-002",
    category: "INTERNAL_RULE",
    ruleName: "《中润农垦集团直采直供与战略招采协同细则》",
    clause: "第十二条【温湿度传感器打卡与冷链考核】",
    version: "v2.0 运行版",
    content: "冷链运输合同必须在附件中明确车载 IoT 温湿度传感器全程监测条款，生鲜原料运输全程温度需恒定在 0℃~4℃ 之间。单次运输温度超标累计达 1 小时以上的，扣减当趟运费总额的 15%；发生解冻变质损坏的，承运方按货物申报价值全额先行赔付。",
    keywords: ["温湿度", "传感器", "冷链", "0℃~4℃", "扣减15%", "全额赔付"]
  },
  {
    id: "RULE-LAW-001",
    docId: "DOC-LAW-001",
    category: "EXTERNAL_LAW",
    ruleName: "《中华人民共和国食品安全法》",
    clause: "第五十条【食品原料与添加剂进货查验强制性规定】",
    version: "2024 现行法",
    content: "食品生产企业采购食品原料、食品添加剂、食品相关产品，应当查验供货者的许可证和产品合格证明文件；对无法提供有效产品合格证明文件的食品原料，不得采购或者使用。采购食品原料应当按照规定如实记录名称、规格、数量、生产日期或者生产批号、保质期、进货日期以及供货者名称、地址、联系方式等内容，并保存相关凭证。",
    keywords: ["进货查验", "合格证明", "食品安全法", "法定红线", "追偿责任"]
  }
];
