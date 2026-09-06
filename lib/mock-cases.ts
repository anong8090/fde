// lib/mock-cases.ts
// 中润农垦食品集团 — 3 组深度高保真国企合同呈批全要素数据（多附件拟真版）

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
        name: "大豆原粮毛油采购与配送框架协议书.pdf",
        size: "2.4 MB",
        type: "pdf",
        category: "主合同",
        docTitle: "大豆原粮毛油采购与配送合同协议书",
        docSubtitle: "合同编号：ZR-PO-202609-0081 · 密级：内部商密",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货方）：中粮油脂控股（北方）销售有限公司",
        clauses: [
          {
            id: "c1-1",
            num: "第一条",
            title: "标的物规格、包装与供货总量",
            content: "乙方向甲方供应一级浸出大豆原粮毛油，质量符合国家行业一级标的规范。采用专用 50kg/食用级钢桶密封包装，本框架合同供货总量核定为 200 吨。"
          },
          {
            id: "c1-2",
            num: "第二条",
            title: "合同价款与计税发票约定",
            content: "经双方集中竞价确认，单价为人民币 5,750.00 元/吨。本次供货清单含税总金额为：¥ 1,150,000.00 元（大写：人民币壹佰壹拾伍万元整）。计税专用发票税率为 9% 增值税专用发票。",
            highlightKey: "amount",
            highlightValue: "¥ 1,150,000.00 元 (税率 9%)",
            isRisk: true,
            riskBadge: "勾稽差额 5 万元"
          },
          {
            id: "c1-3",
            num: "第三条",
            title: "质量验收规范与理化标准",
            content: "标的物进厂验收必须严格执行国家强制性标准《GB 1535-2017 大豆原油》一级理化与卫生安全规范。货物运抵甲方立筒库后，由甲方质检处逐批次抽样检测，不合格坚决拒收。",
            highlightKey: "quality",
            highlightValue: "执行国家 GB 1535-2017 一级标准"
          },
          {
            id: "c1-4",
            num: "第四条",
            title: "款项支付比例与质保金留存",
            content: "合同签署后 3 个工作日内支付 30% 备料款；进厂抽检合格入库后 7 个工作日内支付 65% 进场款；留存 5% 作为质量保证金，质保期 6 个月届满且无质量异议一次性付清。",
            highlightKey: "payment",
            highlightValue: "预付 30% / 进度款 65% / 质保金 5%"
          },
          {
            id: "c1-5",
            num: "第五条",
            title: "争议管辖与法律适用",
            content: "凡因执行本协议所发生之一切争议，双方友好协商解决；协商不成的，由甲方住所地人民法院（即北京市朝阳区人民法院）管辖审理。",
            highlightKey: "jurisdiction",
            highlightValue: "甲方住所地人民法院（朝阳区法院）"
          }
        ],
        signDate: "2026年09月05日",
        sealText: "中粮油脂控股（北方）销售有限公司 合同审查专用章",
        ocrExtractedText: "《大豆原粮毛油采购与配送合同协议书》\n甲方：中润农垦第一食品加工有限公司\n乙方：中粮油脂控股（北方）销售有限公司\n第一条 标的物与金额：\n标的：一级浸出大豆毛油，规格50kg/桶，数量 200 吨。\n供货明细合计：大豆毛油净重 200 吨，单价 5750 元/吨，总计金额小写：¥1,150,000.00 元（大写：人民币壹佰壹拾伍万元整）。\n税率：按 9% 增值税税率开具专用发票。\n争议管辖：由甲方所在地人民法院管辖。",
        extractedFields: {
          contractAmount: 1150000.0,
          supplierName: "中粮油脂控股（北方）销售有限公司",
          acceptanceStandard: "按国家 GB 1535-2017 一级标准验收",
          warrantyClause: "留存 5% 质保金，6个月后无异议结清",
          disputeJurisdiction: "甲方所在地人民法院",
          taxRate: "9% 增值税专用发票"
        }
      },
      {
        id: "att-001-sub2",
        name: "大豆毛油送审供货明细与批次结算单.xlsx",
        size: "860 KB",
        type: "xlsx",
        category: "明细表",
        docTitle: "大豆原粮毛油分批次供货清单与财务对账单",
        docSubtitle: "关联合同号：ZR-PO-202609-0081 · 送审核验附件",
        tableData: {
          headers: ["批次序号", "产品名称与规格", "交割立筒仓", "净重(吨)", "含税单价(元/吨)", "批次总金额(元)", "发票税率"],
          rows: [
            ["第 1 批 (202609A)", "一级浸出大豆毛油 50kg/桶", "天津港1号精炼油立筒库", 70, 5750, "¥ 402,500.00", "9%"],
            ["第 2 批 (202610B)", "一级浸出大豆毛油 50kg/桶", "天津港1号精炼油立筒库", 70, 5750, "¥ 402,500.00", "9%"],
            ["第 3 批 (202611C)", "一级浸出大豆毛油 50kg/桶", "天津港2号精炼油立筒库", 60, 5750, "¥ 345,000.00", "9%"]
          ],
          totalRow: ["供货合计", "共计 3 批次进厂交付", "-", "200 吨", "-", "¥ 1,150,000.00", "与单据申报差额 5 万元"]
        },
        signDate: "2026年09月05日",
        ocrExtractedText: "大豆原粮毛油送审供货明细表：第1批次 70吨 402,500元；第2批次 70吨 402,500元；第3批次 60吨 345,000元。总计金额 1,150,000.00 元整，税率 9%。",
        extractedFields: {
          contractAmount: 1150000.0,
          supplierName: "中粮油脂控股（北方）销售有限公司",
          taxRate: "9% 增值税专用发票"
        }
      },
      {
        id: "att-001-sub3",
        name: "中粮油脂控股企业法人营业执照及AAA资信证书.pdf",
        size: "1.8 MB",
        type: "pdf",
        category: "资质证明",
        docTitle: "企业法人营业执照与大宗物资供应资信核验报告",
        partyB: "相对方主体：中粮油脂控股（北方）销售有限公司",
        clauses: [
          { id: "q1", num: "统一代码", title: "统一社会信用代码", content: "91110000710928345X（北京市朝阳区市场监督管理局登记），注册资本 50,000 万元人民币。" },
          { id: "q2", num: "资信评级", title: "中国诚信信用管理有限公司 AAA 级证书", content: "经大宗粮油商贸资信委员会 2026 年度联合审查，该供方评级为 AAA 级，未列入重大违法失信企业名单。" }
        ],
        signDate: "2026年01月15日",
        ocrExtractedText: "中粮油脂控股（北方）销售有限公司：统一代码 91110000710928345X，法定代表人李秉海，资信等级 AAA，经营范围包含食用植物油脂批发销售。",
        extractedFields: {
          supplierName: "中粮油脂控股（北方）销售有限公司"
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
        name: "复合面包改良剂直供协议（供方修订草案版）.pdf",
        size: "1.6 MB",
        type: "pdf",
        category: "主合同",
        docTitle: "高活性复合面包改良剂及酵母伴侣年度战略直供协议",
        docSubtitle: "合同编号：ZR-QC-202609-0115 · 版本：供方安琪生物修订版",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货方）：上海安琪生物发酵工程技术有限公司",
        clauses: [
          {
            id: "c2-1",
            num: "第一条",
            title: "标的物规格与供货金额",
            content: "乙方向甲方提供高纤吐司专用复合发酵改良剂 20 吨。含税总金额为人民币 ¥ 380,000.00 元整（大写：人民币叁拾捌万元整），开具 13% 增值税专用发票。"
          },
          {
            id: "c2-2",
            num: "第二条",
            title: "款项支付结算方式",
            content: "合同签署生效后支付预付款 20%；产品交付经初验合格后支付 75% 进度款；留存 5% 作为质保金，产品质保期为 12 个月。"
          },
          {
            id: "c2-3",
            num: "第三条",
            title: "质量验收标准与免责约定（重大争议条款）",
            content: "乙方保证所供原料符合其供方企业标准 Q/AQ 2024-08。货物送达甲方烘焙车间原料库后，抽验批次出厂合格率达到 95.0% 即满足验收标准，视为合格收货入库；若发生批次理化争议，免除乙方提供国家级第三方 CMA/CNAS 检测报告之义务，直接由供方所在地检验所复核为准，供方最高违约责任以该批次发货金额为限。",
            highlightKey: "quality_conflict",
            highlightValue: "合格率 95.0% 即可入库 · 免除第三方 CMA 报告",
            isRisk: true,
            riskBadge: "严重突破集团 99.8% 底线"
          },
          {
            id: "c2-4",
            num: "第四条",
            title: "争议管辖与仲裁约定",
            content: "协议履行中如有任何争议，提交上海仲裁委员会按其仲裁规则裁决。"
          }
        ],
        signDate: "2026年09月05日",
        sealText: "上海安琪生物发酵工程技术有限公司 业务合同章",
        ocrExtractedText: "《高活性复合发酵改良剂购销合同》\n第三条 质量标准与验收方式：\n乙方承诺所供复合食品添加剂符合一般工业食品通用标准。货物到达甲方烘焙工厂后，抽样检验出厂合格率达到 95.0% 即视为满足验收标准，甲方应在到货后 3 个工作日内完成签收并支付 75% 到货款。双方若因原料发生质量争议，由乙方委托之本地检测机构出具复核结果作为唯一仲裁依据。乙方最高违约赔偿责任以该批次货款为限。",
        extractedFields: {
          contractAmount: 380000.0,
          supplierName: "上海安琪生物发酵工程技术有限公司",
          acceptanceStandard: "抽检合格率达 95.0% 即可验收付款，免第三方 CMA 强制认证",
          warrantyClause: "质保金 5%，责任上限仅为批次货款",
          disputeJurisdiction: "供方指定之本地检测机构",
          taxRate: "13% 增值税专用发票"
        }
      },
      {
        id: "att-002-sub2",
        name: "改良剂配方成分理化分析与送检对照表.xlsx",
        size: "780 KB",
        type: "xlsx",
        category: "技术附录",
        docTitle: "高活性改良剂原料生化指标与理化复测报告",
        tableData: {
          headers: ["测试项目", "企业企标要求", "中润集团合规底线", "供方送检值", "核验结论"],
          rows: [
            ["木聚糖酶活性", "≥ 5,000 u/g", "≥ 5,000 u/g", "5,200 u/g", "符合"],
            ["重金属(以Pb计)", "≤ 1.0 mg/kg", "≤ 0.5 mg/kg", "0.4 mg/kg", "符合"],
            ["出厂整批合格率", "95.0%", "99.8% (刚性底线)", "95.0% (企标)", "⚠️ 严重突破集团底线"]
          ]
        },
        signDate: "2026年09月04日",
        ocrExtractedText: "配方理化分析表：木聚糖酶符合要求；重金属符合要求；出厂合格率 95.0%，低于集团质量规范 99.8% 刚性底线要求。",
        extractedFields: {
          acceptanceStandard: "抽检合格率 95.0%"
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
        legalPerson: "陈顺海",
        registeredCapital: "15,000 万元人民币",
        creditRating: "AAA",
        riskStatus: "NORMAL",
        riskDetails: ["国家 AAAAA 级冷链物流企业", "入选全国生鲜保供绿色通道名录"]
      },
      department: "仓储冷链物流事业部",
      applicant: "王洪波（物流调度主管）",
      applicantPhone: "13700112233",
      applyDate: "2026-09-05",
      signingPlace: "山东省寿光市现代农业高新技术示范区",

      totalAmount: 420000.0,
      totalAmountChinese: "人民币肆拾贰万元整",
      untaxedAmount: 385321.10,
      taxRate: "9% 交通运输增值税专用发票",
      budgetSubject: "2026年度基地生鲜原材料冷链物流专项费用",
      budgetCode: "YS-2026-LOG-0203",
      procurementType: "入围名录免招标战略直采",
      paymentMethod: "按月度实际发车托运清单结算，次月 15 日前电汇支付",
      prepaymentRatio: 0,
      progressPaymentRatio: 100,
      warrantyRatio: 0,
      bankAccount: "中国建设银行上海陆家嘴分行 · 31050161450000998",

      deliveryStartDate: "2026-09-10",
      deliveryEndDate: "2027-09-09",
      deliveryLocation: "山东寿光基地、烟台基地至天津及北京中央厨房",
      qualityStandard: "全程冷链温控 -18℃ 至 4℃，车厢加装实时 GPS 与多点温度记录仪，数据直传甲方中台",
      warrantyPeriod: "常态化运输在途保险覆盖 100%",
      disputeJurisdiction: "合同签订地仲裁机构（济南仲裁委员会）",
      liabilityCapClause: "因失温导致的货损由承运方按货值 100% 赔偿",

      isMajorPartyMatter: false,
      hasMajorPartyResolution: true,
      majorPartyResolutionNo: "ZR-2026-ZB-088",
      approvalBasisDoc: "中润冷批〔2026〕019号《关于确定 2026 年度基地生鲜冷链承运入围单位的决定》",
      antiSplitStatement: true,
      summary: "为保障山东生鲜生产基地向华北各精炼加工厂的果蔬原料保鲜运输，依托年度 A 级合格承运商入围成果，申请按框架单价签订年度直采直运协议。"
    },
    attachments: [
      {
        id: "att-003",
        name: "鲜活果蔬原产地冷链直采直运年度框架协议.pdf",
        size: "2.1 MB",
        type: "pdf",
        category: "主合同",
        docTitle: "山东生产基地鲜活果蔬原产地冷链直采直运年度框架协议",
        docSubtitle: "合同编号：ZR-LOG-202609-0203 · 绿色通道保供协议",
        partyA: "甲方（发运方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（承运方）：顺丰冷链物流（上海）有限公司",
        clauses: [
          {
            id: "c3-1",
            num: "第一条",
            title: "服务标的与年度运费总额",
            content: "乙方为甲方山东寿光与烟台生产基地提供鲜活果蔬冷链直采直运干线冷链物流服务。年度框架预算服务总额为：¥ 420,000.00 元整（大写：人民币肆拾贰万元整），开具 9% 交通运输增值税专用发票。",
            highlightKey: "amount",
            highlightValue: "¥ 420,000.00 元 (税率 9%)"
          },
          {
            id: "c3-2",
            num: "第二条",
            title: "采购准入合规与免招标资质认定",
            content: "经甲方招标采购委员会核准，乙方已正式入围中润农垦集团 2026 年度 A 级战略冷链承运商合格名录（入围档案编号：ZR-LOG-QUAL-A019），履约资信 AAA 级，符合集团《大宗物资与直运采购管理细则》免于公开招标、实施战略直签之合规条件。",
            highlightKey: "compliance_pass",
            highlightValue: "入围年度 A 级名录 · 符合免公开招标",
            isRisk: false,
            riskBadge: "合规准入"
          },
          {
            id: "c3-3",
            num: "第三条",
            title: "全程冷链温控技术与在途监控标准",
            content: "乙方投入运营的所有冷藏车辆必须具备全程实时 GPS 卫星定位系统及多点无线温度记录传感器，运送生鲜车厢温度严格控制在 -18℃ 至 4℃ 恒温区间，温度数据每 5 分钟直连同步至中润智能物流中台，全程温控达标率不低于 99.9%。",
            highlightKey: "quality",
            highlightValue: "全程温控 -18℃ 至 4℃ · GPS 实时直传"
          },
          {
            id: "c3-4",
            num: "第四条",
            title: "运费对账与结算周期",
            content: "运费结算采用按月实报实销机制，每月 5 日前完成上月运费清单勾稽对账，甲方核准后 15 个工作日内电汇全额支付，不设预付款与质保扣留。"
          }
        ],
        signDate: "2026年09月05日",
        sealText: "顺丰冷链物流（上海）有限公司 业务专用章",
        ocrExtractedText: "《鲜活果蔬冷链直运框架协议》\n甲方：中润农垦第一食品加工有限公司\n乙方：顺丰冷链物流（上海）有限公司\n年度运费预算：420,000.00 元，税率 9%。资质：已入围中润农垦 2026 年度 A 级承运商，符合免招标采购标准。温控要求：全程 -18℃ 至 4℃，GPS 实时监控。",
        extractedFields: {
          contractAmount: 420000.0,
          supplierName: "顺丰冷链物流（上海）有限公司",
          acceptanceStandard: "全程冷链温控 -18℃ 至 4℃，GPS 直连监控",
          warrantyClause: "按月结算，全额承运保险",
          disputeJurisdiction: "济南仲裁委员会",
          taxRate: "9% 增值税专用发票"
        }
      },
      {
        id: "att-003-sub2",
        name: "承运冷藏车辆温控GPS实时监控服务标准附录.pdf",
        size: "1.2 MB",
        type: "pdf",
        category: "技术附录",
        docTitle: "冷藏车队 GPS 车辆调度与温控数据接口规范",
        clauses: [
          { id: "ts1", num: "附录一", title: "车队运力配备", content: "常驻投入 10 辆 9.6 米冷藏车，车龄均在 3 年以内，随车配备双温双控备用制冷机组。" },
          { id: "ts2", num: "附录二", title: "API 数据接口", content: "通过顺丰冷链 IoT 开放平台，每 300 秒向中润农垦数据中台推送一次位置与温湿度数据。" }
        ],
        signDate: "2026年09月05日",
        ocrExtractedText: "车队配备 10 辆冷藏车，全程双机组制冷，IoT 温度数据 300 秒直传中台。",
        extractedFields: {
          acceptanceStandard: "IoT 温度 300 秒直传"
        }
      }
    ]
  }
];

export const INITIAL_PUSH_TASKS: PushTaskItem[] = MOCK_CASES.map((c) => c.taskItem);
