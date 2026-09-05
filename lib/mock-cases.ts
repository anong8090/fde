// lib/mock-cases.ts
// 中润农垦食品集团 — 3 组深度高保真国企合同呈批全要素数据

import { ApprovalFormData, AttachmentFile, PushTaskItem, WorkflowNode } from "@/types/fde";

export interface MockCasePackage {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  formData: ApprovalFormData;
  attachments: AttachmentFile[];
  scenarioType: "AMOUNT_MISMATCH" | "QUALITY_CONFLICT" | "FAST_PASS";
  taskItem: PushTaskItem;
  defaultWorkflow: WorkflowNode[];
}

export const MOCK_CASES: MockCasePackage[] = [
  {
    id: "case-amount-mismatch",
    badge: "案例一",
    badgeColor: "#d97706",
    title: "万吨大豆毛油采购（金额差额 5 万 + 缺三重一大决议）",
    tagline: "表单申报 120 万 vs 附件清单 115 万，且超百万未附党委会纪要",
    scenarioType: "AMOUNT_MISMATCH",
    taskItem: {
      id: "REQ-202609-001",
      caseId: "case-amount-mismatch",
      contractTitle: "2026年度秋季万吨级大豆原粮毛油采购框架协议",
      contractNo: "ZR-PO-202609-0081",
      department: "大宗原料采购部",
      applicant: "张建国（高级采购经理）",
      supplierName: "中粮油脂控股（北方）销售有限公司",
      totalAmount: 1200000.0,
      sourceSystem: "OA协同办公系统",
      pushedAt: "2026-09-05 20:30",
      riskLevel: "WARNING",
      status: "PENDING_REVIEW",
      alertSnippet: "⚠️ 存在 ¥50,000 元勾稽差额；金额超 100 万元未附“三重一大”党委会前置决议文号"
    },
    defaultWorkflow: [
      { stepIndex: 1, nodeName: "经办人编制发起", assignee: "张建国", roleTitle: "采购经理", status: "FINISHED", handleTime: "2026-09-05 16:20", opinion: "根据第四季度油脂精炼生产计划，发起毛油采购呈批。" },
      { stepIndex: 2, nodeName: "部门负责人初核", assignee: "郭宏伟", roleTitle: "原料部部长", status: "FINISHED", handleTime: "2026-09-05 17:45", opinion: "同意采购申请，请财务核准发票税率及大额前置纪要。" },
      { stepIndex: 3, nodeName: "财务资产部审查", assignee: "马淑芬", roleTitle: "财务总监", status: "FINISHED", handleTime: "2026-09-05 19:10", opinion: "【财务核验存疑】呈批单申报 120 万与附件明细总计 115 万存在 5 万元差额，税率亦有出入，建议退回补正。" },
      { stepIndex: 4, nodeName: "法务合规部审查", assignee: "陈律", roleTitle: "法务风控主管", status: "FINISHED", handleTime: "2026-09-05 20:15", opinion: "【法务审查意见】超百万元重大资金未见党委会三重一大决议文号，属阻断项，呈分管领导审定。" },
      { stepIndex: 5, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待分管领导最终签批决策。" }
    ],
    formData: {
      id: "REQ-202609-001",
      caseId: "case-amount-mismatch",
      contractTitle: "2026年度秋季万吨级大豆原粮毛油采购框架协议",
      contractNo: "ZR-PO-202609-0081",
      contractType: "大宗生产原料类采购合同",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "中粮油脂控股（北方）销售有限公司",
      supplierCredit: {
        creditCode: "91110000710928345X",
        legalPerson: "李秉海",
        registeredCapital: "50,000 万元人民币",
        creditRating: "AAA",
        riskStatus: "NORMAL",
        riskDetails: ["工商经营正常", "未发现被执行人记录", "具备全国油脂一级批发准入资质"]
      },
      department: "大宗原料采购部",
      applicant: "张建国（高级采购经理）",
      applicantPhone: "13800100881",
      applyDate: "2026-09-05",
      signingPlace: "北京市朝阳区中润农垦大厦",

      totalAmount: 1200000.0,
      totalAmountChinese: "人民币壹佰贰拾万元整",
      untaxedAmount: 1100917.43,
      taxRate: "13% 增值税专用发票",
      budgetSubject: "2026年度食用植物油原料专项采购预算",
      budgetCode: "YS-2026-DP-0081",
      procurementType: "集中竞价集中采购",
      paymentMethod: "银行承兑汇票，首期预付款 30%，货到质检验收合格后支付 65%，留存 5% 质保金",
      prepaymentRatio: 30,
      progressPaymentRatio: 65,
      warrantyRatio: 5,
      bankAccount: "中国农业银行北京朝阳支行 · 11090101040008892",

      deliveryStartDate: "2026-09-15",
      deliveryEndDate: "2026-11-30",
      deliveryLocation: "天津港保税区中润第一精炼油工厂立筒库",
      qualityStandard: "国家 GB 1535-2017 大豆原油一级理化与卫生标准，进厂每批次抽检",
      warrantyPeriod: "验收合格入库之日起 6 个月",
      disputeJurisdiction: "甲方住所地人民法院（北京市朝阳区人民法院）",
      liabilityCapClause: "除连带人身与食品安全法律责任外，一般延期违约金上限为合同总额 10%",

      isMajorPartyMatter: true,
      hasMajorPartyResolution: false,
      majorPartyResolutionNo: "",
      approvalBasisDoc: "中润物批〔2026〕042号《关于同意开展秋季大豆毛油集中竞价采买的批复》",
      antiSplitStatement: true,
      summary: "为满足下属第一食品加工厂国庆、中秋双节前夕的大宗食用油精炼生产排班，拟采购一级大豆毛油 200 吨，按集中竞价结果签订采购框架合同。"
    },
    attachments: [
      {
        id: "att-001",
        name: "大豆毛油采购合同（送审扫描件及明细表）.pdf",
        size: "2.4 MB",
        type: "pdf",
        ocrExtractedText: "《大豆原粮毛油采购与配送合同协议书》\n甲方：中润农垦第一食品加工有限公司\n乙方：中粮油脂控股（北方）销售有限公司\n第一条 标的物与金额：\n标的：一级浸出大豆毛油，规格50kg/桶，数量 200 吨。\n供货明细合计：大豆毛油净重 200 吨，单价 5750 元/吨，总计金额小写：¥1,150,000.00 元（大写：人民币壹佰壹拾伍万元整）。\n税率：按 9% 增值税税率开具专用发票。\n争议管辖：由甲方所在地人民法院管辖。",
        extractedFields: {
          contractAmount: 1150000.0,
          supplierName: "中粮油脂控股（北方）销售有限公司",
          acceptanceStandard: "按国家 GB 1535-2017 一级标准验收",
          warrantyClause: "留存 5% 质保金，6个月后无异议结清",
          disputeJurisdiction: "甲方所在地人民法院",
          taxRate: "9% 增值税专用发票"
        }
      }
    ]
  },
  {
    id: "case-quality-conflict",
    badge: "案例二",
    badgeColor: "#dc2626",
    title: "面包发酵改良剂供货协议（食品质检红线违规）",
    tagline: "供方合同约定 95% 合格率验收，与集团食品安全制度强制 99.8% 冲突",
    scenarioType: "QUALITY_CONFLICT",
    taskItem: {
      id: "REQ-202609-002",
      caseId: "case-quality-conflict",
      contractTitle: "高活性复合面包改良剂及酵母伴侣年度战略直供协议",
      contractNo: "ZR-QC-202609-0115",
      department: "烘焙食品技术中心",
      applicant: "李晓雅（品控研发工程师）",
      supplierName: "上海安琪生物发酵工程技术有限公司",
      totalAmount: 380000.0,
      sourceSystem: "ERP供应链采购系统",
      pushedAt: "2026-09-05 21:15",
      riskLevel: "HIGH_RISK",
      status: "PENDING_REVIEW",
      alertSnippet: "🚫 致命合规风险：合同约定 95.0% 合格率验收，违背集团《食品质量合规规范》99.8% 底线且免除第三方 CMA 报告"
    },
    defaultWorkflow: [
      { stepIndex: 1, nodeName: "经办人编制发起", assignee: "李晓雅", roleTitle: "品控工程师", status: "FINISHED", handleTime: "2026-09-05 18:10", opinion: "新产线高纤吐司需引进定制改良剂，提交单一来源直签。" },
      { stepIndex: 2, nodeName: "部门负责人初核", assignee: "杜建华", roleTitle: "研发中心主任", status: "FINISHED", handleTime: "2026-09-05 19:30", opinion: "技术指标符合研发配方，同意报请法务及主管领导审定。" },
      { stepIndex: 3, nodeName: "法务合规部审查", assignee: "陈律", roleTitle: "法务风控主管", status: "FINISHED", handleTime: "2026-09-05 20:40", opinion: "【重大风险预警】供方合同 95% 出厂合格率严重违背集团 99.8% 底线且免除第三方 CMA 报告，建议坚决退回！转呈分管副总审定。" },
      { stepIndex: 4, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待分管领导最终签批决策。" }
    ],
    formData: {
      id: "REQ-202609-002",
      caseId: "case-quality-conflict",
      contractTitle: "高活性复合面包改良剂及酵母伴侣年度战略直供协议",
      contractNo: "ZR-QC-202609-0115",
      contractType: "生产用食品添加剂技术协议",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "上海安琪生物发酵工程技术有限公司",
      supplierCredit: {
        creditCode: "91310115MA1K89034L",
        legalPerson: "吴国强",
        registeredCapital: "2,000 万元人民币",
        creditRating: "A",
        riskStatus: "LAWSUIT_ALERT",
        riskDetails: ["近6个月存在1起买卖合同纠纷被诉记录", "未被列入经营异常名录"]
      },
      department: "烘焙食品技术中心",
      applicant: "李晓雅（品控研发工程师）",
      applicantPhone: "13911223344",
      applyDate: "2026-09-05",
      signingPlace: "上海市松江区生物科技园区",

      totalAmount: 380000.0,
      totalAmountChinese: "人民币叁拾捌万元整",
      untaxedAmount: 336283.19,
      taxRate: "13% 增值税专用发票",
      budgetSubject: "2026年度烘焙面点新产品研发转化与辅料预算",
      budgetCode: "YS-2026-RD-0115",
      procurementType: "技术指定单一来源采购",
      paymentMethod: "电汇转账，预付 20%，货到初验付 75%，质保金 5%",
      prepaymentRatio: 20,
      progressPaymentRatio: 75,
      warrantyRatio: 5,
      bankAccount: "招商银行上海川沙支行 · 310902881290382",

      deliveryStartDate: "2026-09-20",
      deliveryEndDate: "2027-09-19",
      deliveryLocation: "中润第一食品加工厂三期烘焙自动化车间原料库",
      qualityStandard: "供方企业标准（抽样批次合格率达 95% 即符合收货条件）",
      warrantyPeriod: "常温密封存储 12 个月",
      disputeJurisdiction: "供方所在地仲裁委员会（上海仲裁委员会）",
      liabilityCapClause: "供方承担违约赔偿责任以该批次发货金额为上限",

      isMajorPartyMatter: true,
      hasMajorPartyResolution: true,
      majorPartyResolutionNo: "ZR-2026-DZ-041",
      approvalBasisDoc: "中润技批〔2026〕012号《关于同意烘焙线选用单一来源改良剂的专家评审会决议》",
      antiSplitStatement: true,
      summary: "用于自动化烘焙生产线新升级的高纤吐司面包生产，保障发酵面团膨胀系数及货架保鲜期，申请单一来源技术指定直签。"
    },
    attachments: [
      {
        id: "att-002",
        name: "复合面包改良剂采购供货协议_供方修订版.docx",
        size: "1.1 MB",
        type: "docx",
        ocrExtractedText: "《高活性复合发酵改良剂购销合同》\n第三条 质量标准与验收方式：\n乙方承诺所供复合食品添加剂符合一般工业食品通用标准。货物到达甲方烘焙工厂后，抽样检验出厂合格率达到 95.0% 即视为满足验收标准，甲方应在到货后 3 个工作日内完成签收并支付 75% 到货款。双方若因原料发生质量争议，由乙方委托之本地检测机构出具复核结果作为唯一仲裁依据。乙方最高违约赔偿责任以该批次货款为限。",
        extractedFields: {
          contractAmount: 380000.0,
          supplierName: "上海安琪生物发酵工程技术有限公司",
          acceptanceStandard: "抽检合格率达 95.0% 即可验收付款，免第三方 CMA 强制认证",
          warrantyClause: "质保金 5%，责任上限仅为批次货款",
          disputeJurisdiction: "供方指定之本地检测机构",
          taxRate: "13% 增值税专用发票"
        }
      }
    ]
  },
  {
    id: "case-fast-pass",
    badge: "案例三",
    badgeColor: "#059669",
    title: "基地直采鲜果冷链运输服务协议（合规免检极速放行）",
    tagline: "表单与附件要素完全匹配，入围目录符合免招标，AI 一键生成三岗审批放行意见",
    scenarioType: "FAST_PASS",
    taskItem: {
      id: "REQ-202609-003",
      caseId: "case-fast-pass",
      contractTitle: "山东生产基地鲜活果蔬原产地冷链直采直运年度框架协议",
      contractNo: "ZR-LOG-202609-0203",
      department: "仓储冷链物流事业部",
      applicant: "王洪波（物流调度主管）",
      supplierName: "顺丰冷链物流（上海）有限公司",
      totalAmount: 420000.0,
      sourceSystem: "SAP物资主数据平台",
      pushedAt: "2026-09-05 21:40",
      riskLevel: "NORMAL",
      status: "PENDING_REVIEW",
      alertSnippet: "✓ 要素完全勾稽匹配，入围年度 A 级合格名录，符合免公开招标标准，建议快速放行"
    },
    defaultWorkflow: [
      { stepIndex: 1, nodeName: "经办人编制发起", assignee: "王洪波", roleTitle: "调度主管", status: "FINISHED", handleTime: "2026-09-05 19:10", opinion: "鲜果保供时效紧急，拟与入围A级承运商顺丰冷链签订年度直运协议。" },
      { stepIndex: 2, nodeName: "部门负责人初核", assignee: "赵铁柱", roleTitle: "物流总监", status: "FINISHED", handleTime: "2026-09-05 20:00", opinion: "符合保供直签标准，温控与货损考核完备，呈批。" },
      { stepIndex: 3, nodeName: "财务资产部核准", assignee: "马淑芬", roleTitle: "财务总监", status: "FINISHED", handleTime: "2026-09-05 20:45", opinion: "运费单价在年度采购限额内，按月对账电汇合规。" },
      { stepIndex: 4, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待分管领导最终签发用印。" }
    ],
    formData: {
      id: "REQ-202609-003",
      caseId: "case-fast-pass",
      contractTitle: "山东生产基地鲜活果蔬原产地冷链直采直运年度框架协议",
      contractNo: "ZR-LOG-202609-0203",
      contractType: "物流运输与冷链保供服务协议",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "顺丰冷链物流（上海）有限公司",
      supplierCredit: {
        creditCode: "91310000789012345A",
        legalPerson: "高红星",
        registeredCapital: "10,000 万元人民币",
        creditRating: "AAA",
        riskStatus: "NORMAL",
        riskDetails: ["集团年度A级优质承运商", "无涉诉不良信贷记录", "自有冷链车队及温控传感设备"]
      },
      department: "仓储冷链物流事业部",
      applicant: "王洪波（物流调度主管）",
      applicantPhone: "13766554433",
      applyDate: "2026-09-05",
      signingPlace: "山东省烟台市中润农垦保供基地",

      totalAmount: 420000.0,
      totalAmountChinese: "人民币肆拾贰万元整",
      untaxedAmount: 385321.10,
      taxRate: "9% 交通运输业增值税专用发票",
      budgetSubject: "2026年度基地直采冷链干线物流运输服务专项预算",
      budgetCode: "YS-2026-LOG-0203",
      procurementType: "年度入围合格承运商名录直签",
      paymentMethod: "按月结算对账后电汇，无预付款，留存 5% 季度履约金",
      prepaymentRatio: 0,
      progressPaymentRatio: 95,
      warrantyRatio: 5,
      bankAccount: "中国建设银行上海陆家嘴分行 · 3100150000189002",

      deliveryStartDate: "2026-09-10",
      deliveryEndDate: "2027-09-09",
      deliveryLocation: "山东果蔬种植示范基地至第一加工厂保鲜库",
      qualityStandard: "全程 IoT 0℃~4℃ 恒温冷链，超温超 1 小时扣减 15% 运费，货损全额先行赔付",
      warrantyPeriod: "框架期满后无违约扣款结清",
      disputeJurisdiction: "甲方所在地人民法院",
      liabilityCapClause: "冷链脱温损坏按受损货物申报价值 100% 赔偿，无免责上限",

      isMajorPartyMatter: true,
      hasMajorPartyResolution: true,
      majorPartyResolutionNo: "ZR-LOG-2026-P03",
      approvalBasisDoc: "中润运批〔2026〕008号《关于确定2026年度生鲜冷链运输A级合格承运商名录的通知》",
      antiSplitStatement: true,
      summary: "配合加工厂鲜果罐头及果酱果泥生产线保供应急需求，锁定山东产地到加工厂 24 小时恒温 0~4℃ 冷链直达干线运输。"
    },
    attachments: [
      {
        id: "att-003",
        name: "冷链运输服务年度框架协议_正式盖章版.pdf",
        size: "3.8 MB",
        type: "pdf",
        ocrExtractedText: "《中润农垦鲜活农产品冷链物流运输服务协议》\n服务总标的金额上限：¥420,000.00 元（大写：肆拾贰万元整）。\n运输考核条款：乙方承诺全部冷藏车配备实时 IoT 温湿度传感器，车厢温度保持在 0℃~4℃ 范围。每趟运输温度异常超标累计达 1 小时扣减当趟运费 15%，发生货物变质由乙方全额赔付。乙方属于甲方 2026 年度评定之 A 级合格冷链服务商（入围编号 ZR-SUP-2026-A09）。",
        extractedFields: {
          contractAmount: 420000.0,
          supplierName: "顺丰冷链物流（上海）有限公司",
          acceptanceStandard: "全车程 IoT 温湿度 0~4℃ 实时监控打卡",
          warrantyClause: "按月对账，扣减15%超标考核，全额货损险",
          disputeJurisdiction: "甲方所在地人民法院",
          taxRate: "9% 交通运输业增值税专用发票"
        }
      }
    ]
  }
];

export const INITIAL_PUSH_TASKS: PushTaskItem[] = MOCK_CASES.map((c) => c.taskItem);
