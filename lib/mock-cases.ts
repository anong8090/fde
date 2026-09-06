// lib/mock-cases.ts
// FDE 国企大宗采购与集采业务全流程仿真案例数据集 (多页高拟真法务合同规范版)

import { ApprovalFormData, AttachmentFile, FdeMockCase, PushTaskItem } from "@/types/fde";

export const MOCK_CASES: FdeMockCase[] = [
  // =========================================================================
  // 案例一：大宗农产品原油采购 (存在 ¥50,000 勾稽差额、税率差异、缺失党委会纪要)
  // =========================================================================
  {
    id: "case-audit-warn",
    taskItem: {
      id: "REQ-202609-001",
      caseId: "case-audit-warn",
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
      { stepIndex: 1, nodeName: "经办人发起申请", assignee: "张建国", roleTitle: "采购经理", status: "FINISHED", handleTime: "2026-09-05 17:20", opinion: "秋季精炼油排产在即，请领导速批。" },
      { stepIndex: 2, nodeName: "部门负责人初审", assignee: "李振华", roleTitle: "采购总监", status: "FINISHED", handleTime: "2026-09-05 18:40", opinion: "价格符合近期大连商品交易所豆油期货基差范围，同意呈报。" },
      { stepIndex: 3, nodeName: "财务资产部核算", assignee: "马淑芬", roleTitle: "财务总监", status: "FINISHED", handleTime: "2026-09-05 19:30", opinion: "预算指标已预占，税目与发票合规需法务进一步把关。" },
      { stepIndex: 4, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待分管领导签批。" }
    ],
    formData: {
      id: "REQ-202609-001",
      caseId: "case-audit-warn",
      contractTitle: "2026年度秋季万吨级大豆原粮毛油采购框架协议",
      contractNo: "ZR-PO-202609-0081",
      contractType: "大宗生产原料类采购合同",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "中粮油脂控股（北方）销售有限公司",
      supplierCredit: {
        creditCode: "91110000710928345X",
        legalPerson: "李秉海",
        registeredCapital: "120,000 万元人民币",
        creditRating: "AAA",
        riskStatus: "NORMAL",
        riskDetails: ["最高人民法院失信被执行人：无记录", "近三年市场监管行政处罚：无违规记录"]
      },
      department: "大宗原料采购部",
      applicant: "张建国（高级采购经理）",
      applicantPhone: "13800138000",
      applyDate: "2026-09-05",
      signingPlace: "天津市滨海新区粮油产业园",

      totalAmount: 1200000.0,
      totalAmountChinese: "人民币壹佰贰拾万元整",
      untaxedAmount: 1061946.90,
      taxRate: "13% 增值税专用发票",
      budgetSubject: "2026年度食用植物油原料专项采购预算",
      budgetCode: "YS-2026-DP-0081",
      procurementType: "公开竞价采购",
      paymentMethod: "银行电汇 / 见票见货 30 日内付款",
      prepaymentRatio: 30,
      progressPaymentRatio: 65,
      warrantyRatio: 5,
      bankAccount: "中国农业银行北京朝阳支行 · 11090101040009876",

      deliveryStartDate: "2026-09-15",
      deliveryEndDate: "2026-11-30",
      deliveryLocation: "天津港保税区中润第一精炼油工厂立筒库",
      qualityStandard: "国家 GB 1535-2017 大豆原油一级理化与卫生标准，进厂每批次抽检",
      warrantyPeriod: "6 个月",
      disputeJurisdiction: "甲方住所地人民法院（北京市朝阳区人民法院）",
      liabilityCapClause: "合同总金额的 20%",

      isMajorPartyMatter: true,
      hasMajorPartyResolution: false,
      majorPartyResolutionNo: "",
      approvalBasisDoc: "中润粮采字〔2026〕045号立项批文",
      antiSplitStatement: true,
      summary: "为保障 2026 年四季度食用精炼大豆油压榨连续生产，申请依大宗竞价结果向合格供方采购大豆原油 200 吨，总货值 120 万元。"
    },
    attachments: [
      {
        id: "att-001",
        name: "大豆原粮毛油采购与配送合同协议书.pdf",
        size: "2.4 MB",
        type: "pdf",
        category: "主合同",
        totalPages: 3,
        docTitle: "大豆原粮毛油采购与配送合同协议书",
        docSubtitle: "合同编号：ZR-PO-202609-0081 · 密级：内部商密",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货方）：中粮油脂控股（北方）销售有限公司",
        pages: [
          {
            pageNumber: 1,
            headerText: "中润农垦集团采购合同标准文本 · 商密受控（密级：内部商密）",
            preamble: "鉴于甲方因食用植物油精炼加工需要拟采购大宗原料毛油，乙方系依法设立并具备食用农产品大宗贸易与加工资信之合规企业。双方依据《中华人民共和国民法典》、《粮食流通管理条例》及有关法律法规，经自愿、平等协商，订立本合同，共同遵照履行。",
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
                highlightValue: "¥ 1,150,000.00 元",
                isRisk: true,
                riskBadge: "金额及税率与呈批单不一致"
              },
              {
                id: "c1-3",
                num: "第三条",
                title: "质量验收规范与理化标准",
                content: "标的物进厂验收必须严格执行国家强制性标准《GB 1535-2017 大豆原油》一级理化与卫生安全规范，酸价≤1.0mg/g，过氧化值≤5.0mmol/kg，水分及挥发物≤0.15%。货物运抵甲方立筒库后，由甲方质检处逐批次抽样检测，不合格坚决拒收。",
                highlightKey: "quality",
                highlightValue: "国家强制性标准《GB 1535-2017 大豆原油》一级理化与卫生安全规范"
              }
            ],
            footerNote: "第 1 页 / 共 3 页  ·  合同编号：ZR-PO-202609-0081"
          },
          {
            pageNumber: 2,
            headerText: "中润农垦集团采购合同标准文本 · 商密受控（密级：内部商密）",
            clauses: [
              {
                id: "c1-4",
                num: "第四条",
                title: "包装、运输与交货交收",
                content: "乙方负责将货物按甲方排产计划分批次运抵甲方指定天津港保税区中润第一精炼油工厂立筒库。运输在途险由乙方全额投保，卸车交接时以甲方地磅计量净重为准，合理在途损耗率不得超过 0.2%，超出部分由乙方承担。"
              },
              {
                id: "c1-5",
                num: "第五条",
                title: "款项支付比例与质保金留存",
                content: "合同签署后 3 个工作日内支付 30% 备料款；进厂抽检合格入库后 7 个工作日内电汇支付 65% 进场款；留存 5% 作为质量保证金，质保期 6 个月届满且无品质异议一次性付清。",
                highlightKey: "risk_prepay",
                highlightValue: "预付 30% 备料款"
              },
              {
                id: "c1-6",
                num: "第六条",
                title: "双方权利与履约保障",
                content: "乙方承诺具备完整的出厂检验报告与绿色原粮可追溯台账，保证原料非转基因及无农药超标残留。乙方应于签约后 3 个工作日内向甲方出具由国有商业银行开立的履约保函。"
              },
              {
                id: "c1-7",
                num: "第七条",
                title: "违约责任与惩罚性赔偿",
                content: "任一方逾期履约的，每日按迟延履行标的金额的 0.05% 承担违约金；若乙方交付货物经复检未达国标一级导致停产，乙方须无条件全额退还已收货款并按货值 100% 赔偿甲方损失。"
              }
            ],
            footerNote: "第 2 页 / 共 3 页  ·  合同编号：ZR-PO-202609-0081"
          },
          {
            pageNumber: 3,
            headerText: "中润农垦集团采购合同标准文本 · 商密受控（密级：内部商密）",
            clauses: [
              {
                id: "c1-8",
                num: "第八条",
                title: "商业秘密保护与合规廉洁承诺",
                content: "双方对履行本合同所获悉之商业底价、技术工艺与排产数据负有严格保密义务，保密期为三年。双方严禁任何形式的商业贿赂与非正常利益输送。"
              },
              {
                id: "c1-9",
                num: "第九条",
                title: "不可抗力与免责条款",
                content: "因台风、地震、战乱等不可抗力致使无法履行合同的，遇不可抗力一方应在 48 小时内书面通知对方，并在 14 日内提供公证机构证明文件，依法减轻或免除违约责任。"
              },
              {
                id: "c1-10",
                num: "第十条",
                title: "争议解决与排他司法管辖",
                content: "凡因执行本合同所产生的一切争议，双方应友好协商解决；协商不成的，由甲方住所地人民法院（即北京市朝阳区人民法院）管辖诉讼解决。",
                highlightKey: "risk_jurisdiction",
                highlightValue: "甲方住所地人民法院（即北京市朝阳区人民法院）"
              },
              {
                id: "c1-11",
                num: "第十一条",
                title: "合同生效、份数与附件效力",
                content: "本合同一式肆份，甲乙双方各执贰份，自双方法定代表人或授权代表签字并加盖公章（或合同专用章）之日起生效。送审供货明细表作为合同附件一，与本协议具有同等法律效力。"
              }
            ],
            showSeal: true,
            footerNote: "第 3 页 / 共 3 页  ·  合同编号：ZR-PO-202609-0081"
          }
        ],
        signDate: "2026年09月05日",
        sealText: "中粮油脂控股（北方）销售有限公司 合同专用章",
        ocrExtractedText: "《大豆原粮毛油采购与配送合同协议书》\n合同编号：ZR-PO-202609-0081\n甲方：中润农垦第一食品加工有限公司\n乙方：中粮油脂控股（北方）销售有限公司\n第一条 标的规格：一级浸出大豆原粮毛油，供货量 200 吨\n第二条 合同价款：单价 5,750.00 元/吨，总金额 ¥ 1,150,000.00 元整（大写：人民币壹佰壹拾伍万元整），发票税率 9% 增值税专用发票。\n第三条 质量标准：符合 GB 1535-2017 大豆原油一级标准。\n第四条 款项支付：预付款 30%，进度款 65%，质保金 5%。\n第十条 争议解决：甲方住所地人民法院管辖。",
        extractedFields: {
          contractAmount: 1150000.0,
          supplierName: "中粮油脂控股（北方）销售有限公司",
          taxRate: "9% 增值税专用发票",
          acceptanceStandard: "国家 GB 1535-2017 大豆原油一级理化与卫生标准",
          disputeJurisdiction: "甲方住所地人民法院（北京市朝阳区人民法院）",
          warrantyClause: "预付款30%，进度款65%，质保金5%（留存6个月）"
        }
      },
      {
        id: "att-001-sub2",
        name: "大豆原粮毛油分批次供货清单与财务对账单.pdf",
        size: "1.1 MB",
        type: "pdf",
        category: "明细表",
        totalPages: 1,
        docTitle: "大豆原粮毛油分批次供货清单与财务对账单",
        docSubtitle: "关联主合同号：ZR-PO-202609-0081 · 送审核验附件",
        partyA: "甲方（采购/发包方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货/承接方）：中粮油脂控股（北方）销售有限公司",
        tableData: {
          headers: ["批次序号", "产品名称与规格", "交割立筒仓", "净重(吨)", "含税单价(元/吨)", "批次总金额", "发票税率"],
          rows: [
            ["第 1 批 (202609A)", "一级浸出大豆毛油 50kg/桶", "天津港1号精炼油立筒库", 70, 5750, "¥ 402,500.00", "9%"],
            ["第 2 批 (202610B)", "一级浸出大豆毛油 50kg/桶", "天津港1号精炼油立筒库", 70, 5750, "¥ 402,500.00", "9%"],
            ["第 3 批 (202611C)", "一级浸出大豆毛油 50kg/桶", "天津港2号精炼油立筒库", 60, 5750, "¥ 345,000.00", "9%"]
          ],
          totalRow: ["供货合计", "共计 3 批次进厂交付", "-", "200 吨", "-", "¥ 1,150,000.00", "与单据申报差额 5 万元"]
        },
        signDate: "2026年09月05日",
        sealText: "中粮油脂控股（北方）销售有限公司 储运专用章",
        ocrExtractedText: "大豆原粮毛油送审供货明细表：第1批次 70吨 402,500元；第2批次 70吨 402,500元；第3批次 60吨 345,000元。总计金额 1,150,000.00 元整，税率 9%。",
        extractedFields: {
          contractAmount: 1150000.0,
          taxRate: "9% 增值税专用发票"
        }
      },
      {
        id: "att-001-sub3",
        name: "营业执照副本与食品生产许可资质证书.pdf",
        size: "1.8 MB",
        type: "pdf",
        category: "资质证明",
        totalPages: 1,
        docTitle: "中粮油脂企业法人营业执照 (电子副本) 与资质认证",
        docSubtitle: "统一社会信用代码：91110000710928345X · 国家市场监督管理总局登记",
        signDate: "2026年01月10日",
        sealText: "北京市市场监督管理局 登记备案专用章",
        ocrExtractedText: "营业执照：中粮油脂控股（北方）销售有限公司，统一社会信用代码：91110000710928345X，法定代表人：李秉海，注册资本：120,000 万元人民币。AAA 资信等级，有效在营。",
        extractedFields: {
          supplierName: "中粮油脂控股（北方）销售有限公司"
        }
      }
    ]
  },

  // =========================================================================
  // 案例二：高危辅料直供协议 (抽检合格率 95% 违规放宽、预付款 45% 击穿红线)
  // =========================================================================
  {
    id: "case-high-risk",
    taskItem: {
      id: "REQ-202609-002",
      caseId: "case-high-risk",
      contractTitle: "高活性复合面包改良剂及酵母伴侣年度战略直供协议",
      contractNo: "ZR-QC-202609-0115",
      department: "烘焙食品技术研发中心",
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
      { stepIndex: 1, nodeName: "经办人发起申请", assignee: "李晓雅", roleTitle: "品控工程师", status: "FINISHED", handleTime: "2026-09-05 19:00", opinion: "新配方投产试制急需酵母改良剂，建议加快审批。" },
      { stepIndex: 2, nodeName: "部门负责人初审", assignee: "周建民", roleTitle: "研发总监", status: "FINISHED", handleTime: "2026-09-05 19:40", opinion: "产品配方已做小试，呈报领导签批。" },
      { stepIndex: 3, nodeName: "质量风控部审查", assignee: "陈立新", roleTitle: "质安总监", status: "FINISHED", handleTime: "2026-09-05 20:10", opinion: "提示：合同附带质检条款与集团红线有抵触，请分管总严格把关！" },
      { stepIndex: 4, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待分管领导签批。" }
    ],
    formData: {
      id: "REQ-202609-002",
      caseId: "case-high-risk",
      contractTitle: "高活性复合面包改良剂及酵母伴侣年度战略直供协议",
      contractNo: "ZR-QC-202609-0115",
      contractType: "原辅材料常态化采购协议",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "上海安琪生物发酵工程技术有限公司",
      supplierCredit: {
        creditCode: "91310115MA1K456789",
        legalPerson: "黄国强",
        registeredCapital: "5,000 万元人民币",
        creditRating: "AA",
        riskStatus: "QUALITY_PENALTY",
        riskDetails: ["近 12 个月内因辅料微生物超标被属地市场监管局通报 1 次"]
      },
      department: "烘焙食品技术研发中心",
      applicant: "李晓雅（品控研发工程师）",
      applicantPhone: "13911223344",
      applyDate: "2026-09-05",
      signingPlace: "上海市浦东新区张江高科技园区",

      totalAmount: 380000.0,
      totalAmountChinese: "人民币叁拾捌万元整",
      untaxedAmount: 336283.19,
      taxRate: "13% 增值税专用发票",
      budgetSubject: "2026年度新品烘焙原辅料研发与试产专项预算",
      budgetCode: "YS-2026-RD-0115",
      procurementType: "单一来源定向直采",
      paymentMethod: "银行电汇 / 预付首款分段结算",
      prepaymentRatio: 45,
      progressPaymentRatio: 55,
      warrantyRatio: 0,
      bankAccount: "招商银行上海张江支行 · 310901234500067",

      deliveryStartDate: "2026-09-10",
      deliveryEndDate: "2027-03-31",
      deliveryLocation: "中润农垦第一食品华东中央烘焙工场",
      qualityStandard: "出厂抽检合格率达标即可，按 95.0% 批量收货，免除第三方 CMA 检测报告",
      warrantyPeriod: "12 个月",
      disputeJurisdiction: "乙方住所地人民法院（上海市浦东新区人民法院）",
      liabilityCapClause: "以单批次发生问题货值的 50% 为赔偿上限",

      isMajorPartyMatter: false,
      hasMajorPartyResolution: false,
      approvalBasisDoc: "中润研办〔2026〕012号立项纪要",
      antiSplitStatement: true,
      summary: "为提升欧包及预制烘焙冷冻面团保鲜活性，拟与上海安琪直采年度复合面包改良剂 20 吨。"
    },
    attachments: [
      {
        id: "att-002",
        name: "高活性复合面包改良剂直供框架协议.pdf",
        size: "1.9 MB",
        type: "pdf",
        category: "主合同",
        totalPages: 2,
        docTitle: "高活性复合面包改良剂直供框架协议",
        docSubtitle: "合同编号：ZR-QC-202609-0115 · 密级：受控商用",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货方）：上海安琪生物发酵工程技术有限公司",
        pages: [
          {
            pageNumber: 1,
            headerText: "中润农垦集团采购合同标准文本 · 商密受控（密级：内部商密）",
            preamble: "鉴于甲方因工业化烘焙面包产线改良需要，向乙方订购专用复合发酵改良剂。双方根据有关法律法规，在平等自愿基础上签署本协议。",
            clauses: [
              {
                id: "c2-1",
                num: "第一条",
                title: "产品标的与采购总额",
                content: "乙方向甲方供应食品级高活性复合面包改良剂 20 吨，合同总金额为 ¥ 380,000.00 元（大写：人民币叁拾捌万元整），开具 13% 增值税专用发票。",
                highlightKey: "amount",
                highlightValue: "¥ 380,000.00 元"
              },
              {
                id: "c2-2",
                num: "第二条",
                title: "质量标准与免检约定（重度违规）",
                content: "鉴于发酵辅料活性特性，双方约定到厂抽检合格率达到 95.0% 即视为批次验收合格并予以全额入库接收，双方免于出具国家认可第三方机构（CMA/CNAS）出厂复检检验报告。",
                highlightKey: "quality",
                highlightValue: "合格率达到 95.0% 即视为批次验收合格",
                isRisk: true,
                riskBadge: "严重跌破集团99.8%质量红线"
              },
              {
                id: "c2-3",
                num: "第三条",
                title: "高比例预付款与结算方式",
                content: "协议签订后 5 个工作日内，甲方向乙方电汇支付合同总价 45% 的预付款；首批到货入库后 10 日内结清剩余 55% 货款，不留存产品质量保证金。",
                highlightKey: "risk_prepay",
                highlightValue: "支付合同总价 45% 的预付款",
                isRisk: true,
                riskBadge: "预付款45%超30%红线"
              }
            ],
            footerNote: "第 1 页 / 共 2 页  ·  合同编号：ZR-QC-202609-0115"
          },
          {
            pageNumber: 2,
            headerText: "中润农垦集团采购合同标准文本 · 商密受控（密级：内部商密）",
            clauses: [
              {
                id: "c2-4",
                num: "第四条",
                title: "违约责任上限与排他管辖",
                content: "因乙方改良剂品质异常造成的任何直接或间接烘焙货损，乙方向甲方承担的最高累计赔偿上限不得超过该批次货款金额的 50%；双方若发生纠纷，严格由乙方住所地人民法院（上海市浦东新区人民法院）管辖审理。",
                highlightKey: "risk_jurisdiction",
                highlightValue: "乙方住所地人民法院（上海市浦东新区人民法院）",
                isRisk: true,
                riskBadge: "偏袒乙方排他管辖"
              },
              {
                id: "c2-5",
                num: "第五条",
                title: "合同生效与签署",
                content: "本合同经双方法定代表人签字并加盖双方合同章后生效，一式肆份，双方各执贰份。"
              }
            ],
            showSeal: true,
            footerNote: "第 2 页 / 共 2 页  ·  合同编号：ZR-QC-202609-0115"
          }
        ],
        signDate: "2026年09月05日",
        sealText: "上海安琪生物发酵工程技术有限公司 业务专用章",
        ocrExtractedText: "《高活性复合面包改良剂直供框架协议》\n合同编号：ZR-QC-202609-0115\n总价：380,000.00 元整，税率 13%。\n质量条款：约定批次出厂检验合格率 95.0% 即可入库，免除第三方 CMA 检验报告。\n付款条款：预付款 45%，到货付 55%，无质保金。\n争议管辖：乙方住所地人民法院。",
        extractedFields: {
          contractAmount: 380000.0,
          supplierName: "上海安琪生物发酵工程技术有限公司",
          taxRate: "13% 增值税专用发票",
          acceptanceStandard: "合格率 95.0% 验收，免除第三方 CMA 检测报告",
          disputeJurisdiction: "上海市浦东新区人民法院",
          warrantyClause: "预付款 45%，到货付 55%，无质保金"
        }
      },
      {
        id: "att-002-sub2",
        name: "理化指标抽检标准与第三方CMA检测合格对照表.pdf",
        size: "1.3 MB",
        type: "pdf",
        category: "明细表",
        totalPages: 1,
        docTitle: "面包改良剂理化检测与技术出厂标准对照表",
        docSubtitle: "关联编号：ZR-QC-202609-0115 · 品控抽检附表",
        tableData: {
          headers: ["检测项目指标", "中润集团标准底线", "合同约定标准", "第三方CMA报告", "合规初判"],
          rows: [
            ["批次出厂合格率", "≥ 99.8%", "≥ 95.0%", "免除出具", "❌ 严重违背红线"],
            ["大肠菌群限量", "不得检出", "≤ 10 CFU/g", "内部自检报告", "⚠️ 存在放宽风险"],
            ["重金属铅含量 (以Pb计)", "≤ 0.5 mg/kg", "≤ 0.8 mg/kg", "内部自检报告", "❌ 违规超标约定"],
            ["烘焙发酵力指标", "≥ 650 ml/hr", "≥ 600 ml/hr", "企业标准", "符合试制要求"]
          ]
        },
        signDate: "2026年09月05日",
        sealText: "上海安琪生物发酵工程技术有限公司 技术检验专用章",
        ocrExtractedText: "指标对照表：出厂合格率约定 95.0%，低于集团标准底线 99.8%；重金属铅限量约定 0.8mg/kg，高于标准 0.5mg/kg；免除出具第三方 CMA 报告。",
        extractedFields: {
          acceptanceStandard: "合格率 95.0%，免除第三方 CMA 报告"
        }
      }
    ]
  },

  // =========================================================================
  // 案例三：冷链物流年度框架直采 (入围合格战略名录、免公开招标合规通过)
  // =========================================================================
  {
    id: "case-fast-pass",
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
        totalPages: 2,
        docTitle: "山东生产基地鲜活果蔬原产地冷链直采直运年度框架协议",
        docSubtitle: "合同编号：ZR-LOG-202609-0203 · 绿色通道保供协议",
        partyA: "甲方（发运方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（承运方）：顺丰冷链物流（上海）有限公司",
        pages: [
          {
            pageNumber: 1,
            headerText: "中润农垦集团采购合同标准文本 · 绿色保供受控文本",
            preamble: "鉴于甲方生鲜果蔬原产地原料外调需要，依托集团合格冷链承运商入围战略招标成果，双方签订本直运框架服务协议。",
            clauses: [
              {
                id: "c3-1",
                num: "第一条",
                title: "服务标的与年度运费总额",
                content: "乙方为甲方山东寿光与烟台生产基地提供鲜活果蔬冷链直采直运干线冷链物流服务。年度框架预算服务总额为：¥ 420,000.00 元整（大写：人民币肆拾贰万元整），开具 9% 交通运输增值税专用发票。",
                highlightKey: "amount",
                highlightValue: "¥ 420,000.00 元"
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
              }
            ],
            footerNote: "第 1 页 / 共 2 页  ·  合同编号：ZR-LOG-202609-0203"
          },
          {
            pageNumber: 2,
            headerText: "中润农垦集团采购合同标准文本 · 绿色保供受控文本",
            clauses: [
              {
                id: "c3-4",
                num: "第四条",
                title: "运费对账与结算周期",
                content: "运费结算采用按月实报实销机制，每月 5 日前完成上月运费清单勾稽对账，甲方核准后 15 个工作日内电汇全额支付，不设预付款与质保扣留。"
              },
              {
                id: "c3-5",
                num: "第五条",
                title: "违约赔偿与仲裁管辖",
                content: "因乙方设备故障或违规操作导致车厢失温损坏货物的，乙方按货值 100% 承担全额赔偿责任。双方争议一致同意由济南仲裁委员会依法仲裁解决。",
                highlightKey: "jurisdiction",
                highlightValue: "济南仲裁委员会"
              }
            ],
            showSeal: true,
            footerNote: "第 2 页 / 共 2 页  ·  合同编号：ZR-LOG-202609-0203"
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
        totalPages: 1,
        docTitle: "冷藏车队 GPS 车辆调度与温控数据接口规范",
        clauses: [
          { id: "ts1", num: "附录一", title: "车队运力配备", content: "常驻投入 10 辆 9.6 米冷藏车，车龄均在 3 年以内，随车配备双温双控备用制冷机组。" },
          { id: "ts2", num: "附录二", title: "API 数据接口", content: "通过顺丰冷链 IoT 开放平台，每 300 秒向中润农垦数据中台推送一次位置与温湿度数据。" }
        ],
        signDate: "2026年09月05日",
        sealText: "顺丰冷链物流（上海）有限公司 调度专用章",
        ocrExtractedText: "车队配备 10 辆冷藏车，全程双机组制冷，IoT 温度数据 300 秒直传中台。",
        extractedFields: {
          acceptanceStandard: "IoT 温度 300 秒直传"
        }
      }
    ]
  },

  // =========================================================================
  // 案例四：绿色有机蔬菜基地直配框架协议 (入围 A 级战略名录、合规免检)
  // =========================================================================
  {
    id: "case-fast-pass-2",
    taskItem: {
      id: "REQ-202609-004",
      caseId: "case-fast-pass-2",
      contractTitle: "山东寿光现代农业基地绿色有机蔬菜年度直配框架协议",
      contractNo: "ZR-AGR-202609-0301",
      department: "基地直采事业部",
      applicant: "刘建民（基地直采专员）",
      supplierName: "山东寿光农发绿色果蔬集团有限公司",
      totalAmount: 310000.0,
      sourceSystem: "ERP供应链采购系统",
      pushedAt: "2026-09-06 08:10",
      riskLevel: "NORMAL",
      status: "PENDING_REVIEW",
      alertSnippet: "✓ 准入资质审核完备，入选省农业产业化龙头企业，要素无差额，符合合规免检放行条件"
    },
    defaultWorkflow: [
      { stepIndex: 1, nodeName: "经办人发起申请", assignee: "刘建民", roleTitle: "直采专员", status: "FINISHED", handleTime: "2026-09-06 07:40", opinion: "寿光秋茬黄瓜与西红柿进入保供期，直采价格低于农贸批发价8%。" },
      { stepIndex: 2, nodeName: "部门负责人初审", assignee: "赵铁柱", roleTitle: "采购总监", status: "FINISHED", handleTime: "2026-09-06 08:00", opinion: "符合基地直供标准，呈报领导签批。" },
      { stepIndex: 3, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待签发。" }
    ],
    formData: {
      id: "REQ-202609-004",
      caseId: "case-fast-pass-2",
      contractTitle: "山东寿光现代农业基地绿色有机蔬菜年度直配框架协议",
      contractNo: "ZR-AGR-202609-0301",
      contractType: "生鲜初级农产品保供直采协议",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "山东寿光农发绿色果蔬集团有限公司",
      supplierCredit: {
        creditCode: "91370783MA3M123456",
        legalPerson: "孙光辉",
        registeredCapital: "8,000 万元人民币",
        creditRating: "AAA",
        riskStatus: "NORMAL",
        riskDetails: ["国家级农业产业化重点龙头企业", "全国绿色食品原料标准化生产基地认证"]
      },
      department: "基地直采事业部",
      applicant: "刘建民（基地直采专员）",
      applicantPhone: "13853600001",
      applyDate: "2026-09-06",
      signingPlace: "山东省寿光市农圣街201号",

      totalAmount: 310000.0,
      totalAmountChinese: "人民币叁拾壹万元整",
      untaxedAmount: 284403.67,
      taxRate: "9% 初级农产品免税/专票",
      budgetSubject: "2026年度中央厨房原料直采专项预算",
      budgetCode: "YS-2026-AGR-0301",
      procurementType: "原产地直签",
      paymentMethod: "按周对账结款，次周三电汇支付",
      prepaymentRatio: 0,
      progressPaymentRatio: 100,
      warrantyRatio: 0,
      bankAccount: "中国农业发展银行寿光支行 · 20337078300100098",

      deliveryStartDate: "2026-09-10",
      deliveryEndDate: "2027-08-31",
      deliveryLocation: "天津中央厨房及北京分拨中心",
      qualityStandard: "绿色食品标准，农残检测100%合格附每批次出厂检验码",
      warrantyPeriod: "生鲜验收合格即完结",
      disputeJurisdiction: "合同签订地仲裁机构（潍坊仲裁委员会）",
      liabilityCapClause: "合同总金额的 15%",

      isMajorPartyMatter: false,
      hasMajorPartyResolution: true,
      majorPartyResolutionNo: "ZR-2026-ZB-092",
      approvalBasisDoc: "中润农办〔2026〕033号文",
      antiSplitStatement: true,
      summary: "为落实集团绿色农产品直通车工程，向寿光龙头基地按协议单价直采新鲜果蔬。"
    },
    attachments: [
      {
        id: "att-004",
        name: "山东寿光绿色有机蔬菜直供直配框架协议.pdf",
        size: "1.8 MB",
        type: "pdf",
        category: "主合同",
        totalPages: 2,
        docTitle: "山东寿光现代农业基地绿色有机蔬菜年度直配框架协议",
        docSubtitle: "合同编号：ZR-AGR-202609-0301 · 绿色农产品直通车",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货方）：山东寿光农发绿色果蔬集团有限公司",
        pages: [
          {
            pageNumber: 1,
            headerText: "中润农垦集团采购合同标准文本 · 原粮与生鲜专区",
            preamble: "甲乙双方根据《中华人民共和国民法典》及国家农产品流通有关法律规范，确立基地保供战略协作关系，订立本合同。",
            clauses: [
              {
                id: "c4-1",
                num: "第一条",
                title: "供货标的与服务价款",
                content: "乙方向甲方直配绿色认证日光温室果蔬（含黄瓜、番茄、甜椒等），年度预估直采总额为 ¥ 310,000.00 元整（大写：人民币叁拾壹万元整），税率 9%。",
                highlightKey: "amount",
                highlightValue: "¥ 310,000.00 元"
              },
              {
                id: "c4-2",
                num: "第二条",
                title: "质量安全与农残快检标准",
                content: "标的物严格执行《绿色食品蔬菜标准（NY/T 743）》，批次附带带二维码溯源防伪标识及农残速测合格联单，农残超标批次坚决退货并赔偿全额运费。",
                highlightKey: "quality",
                highlightValue: "《绿色食品蔬菜标准（NY/T 743）》"
              }
            ],
            footerNote: "第 1 页 / 共 2 页  ·  合同编号：ZR-AGR-202609-0301"
          },
          {
            pageNumber: 2,
            headerText: "中润农垦集团采购合同标准文本 · 原粮与生鲜专区",
            clauses: [
              {
                id: "c4-3",
                num: "第三条",
                title: "结算方式与免担保直签条件",
                content: "乙方系国家级龙头企业，本次签约免于缴纳履约保证金，采用周结对账机制，次周三全额电汇付清。",
                highlightKey: "compliance_pass",
                highlightValue: "国家级龙头企业 · 免保函"
              },
              {
                id: "c4-4",
                num: "第四条",
                title: "司法仲裁管辖约定",
                content: "合同履行中产生争议由潍坊仲裁委员会依法仲裁裁决。"
              }
            ],
            showSeal: true,
            footerNote: "第 2 页 / 共 2 页  ·  合同编号：ZR-AGR-202609-0301"
          }
        ],
        signDate: "2026年09月06日",
        sealText: "山东寿光农发绿色果蔬集团有限公司 业务合同章",
        ocrExtractedText: "《绿色果蔬直配框架协议》\n甲方：中润农垦第一食品加工有限公司\n乙方：山东寿光农发绿色果蔬集团有限公司\n年度总额：310,000.00 元，税率 9%。\n质量：绿色食品 NY/T 743 标准，批次带溯源码。\n无差额，资质完备。",
        extractedFields: {
          contractAmount: 310000.0,
          supplierName: "山东寿光农发绿色果蔬集团有限公司",
          acceptanceStandard: "绿色食品蔬菜标准（NY/T 743），批次附带农残检测溯源码",
          disputeJurisdiction: "潍坊仲裁委员会",
          taxRate: "9% 初级农产品免税/专票"
        }
      }
    ]
  },

  // =========================================================================
  // 案例五：天津工厂高速包装机年度备件直采 (年度战略入围备件、合规免检)
  // =========================================================================
  {
    id: "case-fast-pass-3",
    taskItem: {
      id: "REQ-202609-005",
      caseId: "case-fast-pass-3",
      contractTitle: "天津精炼厂全自动高速吹瓶包装线年度备品备件集中直采协议",
      contractNo: "ZR-EQ-202609-0412",
      department: "生产设备与动力工程部",
      applicant: "陈长青（装备维护主管）",
      supplierName: "达意隆智能包装机械（天津）有限公司",
      totalAmount: 185000.0,
      sourceSystem: "SAP物资主数据平台",
      pushedAt: "2026-09-06 08:25",
      riskLevel: "NORMAL",
      status: "PENDING_REVIEW",
      alertSnippet: "✓ 原厂原装易损件框架协议，年度集中比选入围目录，条款无异议，符合快速批量放行"
    },
    defaultWorkflow: [
      { stepIndex: 1, nodeName: "经办人发起申请", assignee: "陈长青", roleTitle: "机修主管", status: "FINISHED", handleTime: "2026-09-06 07:50", opinion: "灌装线月度预防性保养备品，拟按原厂框架单价直签。" },
      { stepIndex: 2, nodeName: "设备总监审核", assignee: "周国柱", roleTitle: "设备总监", status: "FINISHED", handleTime: "2026-09-06 08:15", opinion: "原厂质保一年，符合备件集中招投标结果，呈批。" },
      { stepIndex: 3, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待签发。" }
    ],
    formData: {
      id: "REQ-202609-005",
      caseId: "case-fast-pass-3",
      contractTitle: "天津精炼厂全自动高速吹瓶包装线年度备品备件集中直采协议",
      contractNo: "ZR-EQ-202609-0412",
      contractType: "设备维保与备品备件采购合同",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "达意隆智能包装机械（天津）有限公司",
      supplierCredit: {
        creditCode: "91120116789098765B",
        legalPerson: "郑达标",
        registeredCapital: "6,000 万元人民币",
        creditRating: "AAA",
        riskStatus: "NORMAL",
        riskDetails: ["国家专精特新“小巨人”企业", "原装主机设备专属配套服务商"]
      },
      department: "生产设备与动力工程部",
      applicant: "陈长青（装备维护主管）",
      applicantPhone: "13512345678",
      applyDate: "2026-09-06",
      signingPlace: "天津市滨海新区中润精炼工厂",

      totalAmount: 185000.0,
      totalAmountChinese: "人民币壹拾捌万伍仟元整",
      untaxedAmount: 163716.81,
      taxRate: "13% 增值税专用发票",
      budgetSubject: "2026年度生产线备品备件及耗材维护费用",
      budgetCode: "YS-2026-EQ-0412",
      procurementType: "入围名录免招标原厂配套直采",
      paymentMethod: "到货验收合格后 30 日内电汇全款",
      prepaymentRatio: 0,
      progressPaymentRatio: 100,
      warrantyRatio: 0,
      bankAccount: "中国工商银行天津经济技术开发区分行 · 03020101090001234",

      deliveryStartDate: "2026-09-15",
      deliveryEndDate: "2027-09-14",
      deliveryLocation: "天津中润精炼厂备品备件库",
      qualityStandard: "达意隆原厂出厂质检标准，提供原产地证明与合格证",
      warrantyPeriod: "原厂质保 12 个月",
      disputeJurisdiction: "天津仲裁委员会",
      liabilityCapClause: "合同总金额的 20%",

      isMajorPartyMatter: false,
      hasMajorPartyResolution: true,
      majorPartyResolutionNo: "ZR-2026-ZB-071",
      approvalBasisDoc: "中润机批〔2026〕014号",
      antiSplitStatement: true,
      summary: "为保障天津灌装车间4条高速吹灌旋一体化产线连续运转，申请签订年度易损备件直采协议。"
    },
    attachments: [
      {
        id: "att-005",
        name: "包装机械原厂备件年度直供协议.pdf",
        size: "1.5 MB",
        type: "pdf",
        category: "主合同",
        totalPages: 2,
        docTitle: "全自动高速吹瓶包装线年度备品备件集中直采协议",
        docSubtitle: "合同编号：ZR-EQ-202609-0412 · 设备原厂直保件",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（供货方）：达意隆智能包装机械（天津）有限公司",
        pages: [
          {
            pageNumber: 1,
            headerText: "中润农垦集团采购合同标准文本 · 设备备件专版",
            clauses: [
              {
                id: "c5-1",
                num: "第一条",
                title: "标的物及年度供应额度",
                content: "乙方根据甲方生产线维护计划供应全套原厂吹气阀组、伺服温控模组与密封件，年度订单预算总额为 ¥ 185,000.00 元整（大写：人民币壹拾捌万伍仟元整），税率 13%。",
                highlightKey: "amount",
                highlightValue: "¥ 185,000.00 元"
              },
              {
                id: "c5-2",
                num: "第二条",
                title: "原厂品质保证与退换服务",
                content: "乙方保证所有部件均为 100% 达意隆原厂正品并附防伪激光标识，自到厂验收合格起质保 12 个月，出现任何制造缺陷免费 48 小时内派员到场更换。"
              }
            ],
            footerNote: "第 1 页 / 共 2 页  ·  合同编号：ZR-EQ-202609-0412"
          },
          {
            pageNumber: 2,
            headerText: "中润农垦集团采购合同标准文本 · 设备备件专版",
            clauses: [
              {
                id: "c5-3",
                num: "第三条",
                title: "零预付款按期对账结算",
                content: "实行零预付款政策，每批次备件到厂装配测试合格后 30 日内电汇支付该批次款项。"
              },
              {
                id: "c5-4",
                num: "第四条",
                title: "争议管辖与仲裁约定",
                content: "合同争议由天津仲裁委员会依法仲裁。"
              }
            ],
            showSeal: true,
            footerNote: "第 2 页 / 共 2 页  ·  合同编号：ZR-EQ-202609-0412"
          }
        ],
        signDate: "2026年09月06日",
        sealText: "达意隆智能包装机械（天津）有限公司 售后工程专章",
        ocrExtractedText: "《包装设备备件采购协议》\n甲方：中润农垦第一食品加工有限公司\n乙方：达意隆智能包装机械（天津）有限公司\n年度总额：185,000.00 元，税率 13%。\n原厂质保 12 个月，无预付款。",
        extractedFields: {
          contractAmount: 185000.0,
          supplierName: "达意隆智能包装机械（天津）有限公司",
          acceptanceStandard: "达意隆原厂正品出厂合格质检标准，原厂质保 12 个月",
          disputeJurisdiction: "天津仲裁委员会",
          taxRate: "13% 增值税专用发票"
        }
      }
    ]
  },

  // =========================================================================
  // 案例六：数字化分拣车间 AGV 维保协议 (存疑补正：服务清单未明确保险)
  // =========================================================================
  {
    id: "case-audit-warn-2",
    taskItem: {
      id: "REQ-202609-006",
      caseId: "case-audit-warn-2",
      contractTitle: "华北智能化物流仓储AGV搬运机器人系统年度维保与升级服务协议",
      contractNo: "ZR-IT-202609-0520",
      department: "仓储冷链物流事业部",
      applicant: "赵铁柱（物流总监）",
      supplierName: "北京极智嘉科技股份有限公司",
      totalAmount: 260000.0,
      sourceSystem: "OA协同办公系统",
      pushedAt: "2026-09-06 08:30",
      riskLevel: "WARNING",
      status: "PENDING_REVIEW",
      alertSnippet: "⚠️ 附件缺失技术运维安全责任险凭证，且 SLA 响应违约金上限被约定为 0"
    },
    defaultWorkflow: [
      { stepIndex: 1, nodeName: "经办人发起申请", assignee: "赵铁柱", roleTitle: "物流总监", status: "FINISHED", handleTime: "2026-09-06 08:00", opinion: "AGV运行已满两年，建议续签原厂年度保养。" },
      { stepIndex: 2, nodeName: "分管副总经理签批", assignee: "赵志远", roleTitle: "分管副总经理", status: "CURRENT", handleTime: "待签批", opinion: "等待分管领导签批。" }
    ],
    formData: {
      id: "REQ-202609-006",
      caseId: "case-audit-warn-2",
      contractTitle: "华北智能化物流仓储AGV搬运机器人系统年度维保与升级服务协议",
      contractNo: "ZR-IT-202609-0520",
      contractType: "数字化技术服务与维保协议",
      partyA: "中润农垦第一食品加工有限公司",
      supplierName: "北京极智嘉科技股份有限公司",
      supplierCredit: {
        creditCode: "91110108MA0028211M",
        legalPerson: "郑勇",
        registeredCapital: "10,000 万元人民币",
        creditRating: "AA",
        riskStatus: "NORMAL",
        riskDetails: ["全球物流机器人独角兽企业", "合规运营记录良好"]
      },
      department: "仓储冷链物流事业部",
      applicant: "赵铁柱（物流总监）",
      applicantPhone: "13900112233",
      applyDate: "2026-09-06",
      signingPlace: "北京市海淀区中关村软件园",

      totalAmount: 260000.0,
      totalAmountChinese: "人民币贰拾陆万元整",
      untaxedAmount: 245283.02,
      taxRate: "6% 现代信息技术服务专票",
      budgetSubject: "2026年度智能仓储软硬件系统运维专项费用",
      budgetCode: "YS-2026-IT-0520",
      procurementType: "原厂续签服务单一来源",
      paymentMethod: "按季度分 4 期电汇支付",
      prepaymentRatio: 25,
      progressPaymentRatio: 75,
      warrantyRatio: 0,
      bankAccount: "招商银行北京大运村支行 · 110915678900011",

      deliveryStartDate: "2026-10-01",
      deliveryEndDate: "2027-09-30",
      deliveryLocation: "天津中润自动化立体仓库",
      qualityStandard: "7×24 小时远程监控，故障 2 小时到场排除，SLA 履约率 99.5%",
      warrantyPeriod: "常态化维护覆盖全协议期",
      disputeJurisdiction: "北京仲裁委员会",
      liabilityCapClause: "免除服务迟延违约金（存在免责风险）",

      isMajorPartyMatter: false,
      hasMajorPartyResolution: true,
      majorPartyResolutionNo: "ZR-2026-ZB-084",
      approvalBasisDoc: "中润冷批〔2026〕021号",
      antiSplitStatement: true,
      summary: "天津智能立体库 50 台仓储 AGV 搬运系统即将过保，申请续签原厂 2026-2027 年度技术维保。"
    },
    attachments: [
      {
        id: "att-006",
        name: "仓储AGV搬运机器人系统年度维保服务协议.pdf",
        size: "1.7 MB",
        type: "pdf",
        category: "主合同",
        totalPages: 2,
        docTitle: "华北智能化物流仓储AGV机器人系统年度维保协议",
        docSubtitle: "合同编号：ZR-IT-202609-0520 · 核心技术运维协议",
        partyA: "甲方（采购方）：中润农垦第一食品加工有限公司",
        partyB: "乙方（服务方）：北京极智嘉科技股份有限公司",
        pages: [
          {
            pageNumber: 1,
            headerText: "中润农垦集团采购合同标准文本 · 科技信息专版",
            clauses: [
              {
                id: "c6-1",
                num: "第一条",
                title: "运维服务标的与年度服务费",
                content: "乙方为甲方天津立体仓 50 台潜伏式搬运 AGV 及调度控制中台（RMS）提供全天候预防性维保及软件升级服务。年度服务费用为：¥ 260,000.00 元整（大写：人民币贰拾陆万元整），税率 6%。",
                highlightKey: "amount",
                highlightValue: "¥ 260,000.00 元"
              },
              {
                id: "c6-2",
                num: "第二条",
                title: "SLA响应标准与免责异议",
                content: "乙方承诺 7×24 小时待命，四级紧急故障 2 小时内派员赶赴现场。但鉴于算法网络客观不可控性，双方特别约定免除乙方故障迟延赔偿金，且未在协议中附具特种设备运维商业意外险保单。",
                highlightKey: "risk_quality",
                highlightValue: "免除乙方故障迟延赔偿金",
                isRisk: true,
                riskBadge: "免责条款不利且缺少安全险凭据"
              }
            ],
            footerNote: "第 1 页 / 共 2 页  ·  合同编号：ZR-IT-202609-0520"
          },
          {
            pageNumber: 2,
            headerText: "中润农垦集团采购合同标准文本 · 科技信息专版",
            clauses: [
              {
                id: "c6-3",
                num: "第三条",
                title: "按季分期结算与验收核销",
                content: "每季度初首月 10 日前支付季度服务款 25%，每季度末经甲方运维考核达标后核销当季款项。"
              },
              {
                id: "c6-4",
                num: "第四条",
                title: "争议仲裁与签署生效",
                content: "产生纠纷由北京仲裁委员会依法仲裁解决。本协议双方加盖公章后生效。"
              }
            ],
            showSeal: true,
            footerNote: "第 2 页 / 共 2 页  ·  合同编号：ZR-IT-202609-0520"
          }
        ],
        signDate: "2026年09月06日",
        sealText: "北京极智嘉科技股份有限公司 业务专用章",
        ocrExtractedText: "《AGV机器人系统维保协议》\n甲方：中润农垦第一食品加工有限公司\n乙方：北京极智嘉科技股份有限公司\n总价：260,000.00 元，税率 6%。\n条款第2条约定免除故障迟延违约金，未见高空特种设备安全险附件。",
        extractedFields: {
          contractAmount: 260000.0,
          supplierName: "北京极智嘉科技股份有限公司",
          acceptanceStandard: "SLA 响应 2 小时到场，但免除迟延违约金",
          disputeJurisdiction: "北京仲裁委员会",
          taxRate: "6% 现代信息技术服务专票"
        }
      }
    ]
  }
];

// 历史真实拟真已完结审批台账单据库（包含大宗粮油、冷链、产线装备、权威质检等已办结/拦截退回真实全要素单据）
export const HISTORICAL_ARCHIVED_TASKS: PushTaskItem[] = [
  {
    id: "REQ-202609-007",
    caseId: "case-soybean-large",
    contractTitle: "2026年度秋季优质小麦原粮战略直供协议",
    contractNo: "ZR-PO-202609-0042",
    department: "大宗原料采购部",
    applicant: "张建国（高级采购经理）",
    supplierName: "中粮贸易（北方）农产品物流有限公司",
    totalAmount: 8500000.0,
    sourceSystem: "ERP供应链采购系统",
    pushedAt: "2026-09-03 09:10",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 要素完全勾稽匹配，党委会“三重一大”前置审议通过（纪要文号〔2026〕18号），入围国企A级合格名录",
    humanReviewNote: "【准予通过】：原粮价格符合郑商所强麦期货套期保值基差，党委会纪要文号〔2026〕18号完备，质检指标符合国家一等粮标准。准予签发CFCA证书并办理信用证开立。",
    humanSignOffAt: "2026-09-03 14:25"
  },
  {
    id: "REQ-202609-008",
    caseId: "case-audit-warn",
    contractTitle: "食用级精炼菜籽原油集采框架采购合同",
    contractNo: "ZR-PO-202609-0056",
    department: "大宗原料采购部",
    applicant: "王志刚（高级主管）",
    supplierName: "九三粮油工业集团有限公司",
    totalAmount: 3200000.0,
    sourceSystem: "SAP物资主数据平台",
    pushedAt: "2026-09-03 11:30",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 标的规格与价格全量对齐，出厂酸价指标≤0.20mg/g符合国标，结算账期合规",
    humanReviewNote: "【准予通过】：符合《大宗采购管理办法》，质检指标约定批次酸价≤0.20mg/g，满足一级精炼标准，款项按到货检验进度支付，准予签署。",
    humanSignOffAt: "2026-09-03 16:50"
  },
  {
    id: "REQ-202609-009",
    caseId: "case-food-yeast",
    contractTitle: "烘焙专用耐高糖高活性干酵母年度直供协议",
    contractNo: "ZR-QC-202609-0092",
    department: "烘焙食品技术研发中心",
    applicant: "李晓雅（品控研发工程师）",
    supplierName: "安琪酵母股份有限公司",
    totalAmount: 950000.0,
    sourceSystem: "ERP供应链采购系统",
    pushedAt: "2026-09-04 08:45",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 供方具备 ISO22000 认证，出厂合格率约定≥99.8% 底线标准，质保金比例 5% 留存合规",
    humanReviewNote: "【准予通过】：酵母发酵力测试达标（≥1200ml/hr），免检快速通道核验通过，质保金留存 5% 且约定违约上限，同意批准。",
    humanSignOffAt: "2026-09-04 11:15"
  },
  {
    id: "REQ-202609-010",
    caseId: "case-food-yeast",
    contractTitle: "第一食品厂厂区后勤绿化与景观喷淋工程改建合同",
    contractNo: "ZR-HQ-202609-0012",
    department: "行政后勤保障部",
    applicant: "刘洪波（后勤主管）",
    supplierName: "北京盛世绿源园林绿化工程有限公司",
    totalAmount: 495000.0,
    sourceSystem: "OA协同办公系统",
    pushedAt: "2026-09-04 09:20",
    riskLevel: "HIGH_RISK",
    status: "REJECTED",
    alertSnippet: "🚨 严重违规：疑似拆单规避公开招标（同类工程近7日累计超50万元法定公开招标红线）",
    humanReviewNote: "【坚决否决退回】：AI 风险识别严重准确！核查发现后勤部本周内已连续申报两笔 49.5 万元同类绿化改造，实属恶意拆单规避 50 万元公开招标法定红线。坚决否决并终止流程，移交纪检监察处核查！",
    humanSignOffAt: "2026-09-04 14:10"
  },
  {
    id: "REQ-202609-011",
    caseId: "case-coldchain-logistics",
    contractTitle: "华东多温区智能化深冷立体冷库租赁与周转调度协议",
    contractNo: "ZR-LOG-202609-0188",
    department: "仓储冷链物流事业部",
    applicant: "王洪波（物流调度主管）",
    supplierName: "普洛斯物流仓储（中国）有限公司",
    totalAmount: 1850000.0,
    sourceSystem: "OA协同办公系统",
    pushedAt: "2026-09-04 10:00",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 具备全国性冷链仓储网络资质，温控SLA与破损赔偿条款合规，合同排他管辖权设立合规",
    humanReviewNote: "【准予通过】：冷链控温在 -18℃ 至 -22℃，具备温度数据实时远程直连中控平台保障，SLA 违约扣罚条款明确，准予签署。",
    humanSignOffAt: "2026-09-04 16:30"
  },
  {
    id: "REQ-202609-012",
    caseId: "case-filling-line",
    contractTitle: "智能无菌PET高速吹灌旋一体化灌装产线升级改造合同",
    contractNo: "ZR-EQ-202609-0350",
    department: "生产设备与动力工程部",
    applicant: "陈长青（装备维护主管）",
    supplierName: "杭州中亚机械股份有限公司",
    totalAmount: 4600000.0,
    sourceSystem: "SAP物资主数据平台",
    pushedAt: "2026-09-04 13:40",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 列入年度技改预算，党委会“三重一大”前置批复（中润粮采字〔2026〕19号），付款节点挂钩投产验收",
    humanReviewNote: "【准予通过】：产线设备升级已列入集团年度技改专项预算，党委会“三重一大”审议通过（纪要文号〔2026〕19号），付款按 3-3-3-1 节点挂钩验收，同意通过。",
    humanSignOffAt: "2026-09-04 17:50"
  },
  {
    id: "REQ-202609-013",
    caseId: "case-soybean-large",
    contractTitle: "新西兰原产进口高活性浓缩乳清蛋白粉原料供货意向协议",
    contractNo: "ZR-PO-202609-0098",
    department: "大宗原料采购部",
    applicant: "赵铁柱（采购助理）",
    supplierName: "上海丰茂进出口贸易发展有限公司",
    totalAmount: 1600000.0,
    sourceSystem: "ERP供应链采购系统",
    pushedAt: "2026-09-04 15:10",
    riskLevel: "WARNING",
    status: "REJECTED",
    alertSnippet: "⚠️ 资质缺失：进口食品原料未附带海关动植物检疫合格证书与海关原产地备案编号",
    humanReviewNote: "【退回补正】：海关进口货物报关单缺少中华人民共和国海关动植物检疫合格准入编号，且原产国官方卫生证书附件缺失。退回采购部门限期补齐原件后重新发起审查。",
    humanSignOffAt: "2026-09-04 18:20"
  },
  {
    id: "REQ-202609-014",
    caseId: "case-food-yeast",
    contractTitle: "天然柑橘果胶与复配乳化稳定剂年度集中采购协议",
    contractNo: "ZR-QC-202609-0105",
    department: "烘焙食品技术研发中心",
    applicant: "李晓雅（品控研发工程师）",
    supplierName: "杜邦营养食品配料（中国）有限公司",
    totalAmount: 680000.0,
    sourceSystem: "ERP供应链采购系统",
    pushedAt: "2026-09-05 08:30",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 入选集团年度合格原料名录，全要素勾稽无差异，CMA第三方检测证书齐备",
    humanReviewNote: "【准予通过】：技术指标满足高果胶凝胶度要求，开具 13% 增值税专用发票，质检合格后 60 日内电汇付款，同意签署。",
    humanSignOffAt: "2026-09-05 11:20"
  },
  {
    id: "REQ-202609-015",
    caseId: "case-coldchain-logistics",
    contractTitle: "鲁冀冷链干线零担物流直配运输年度服务协议",
    contractNo: "ZR-LOG-202609-0195",
    department: "仓储冷链物流事业部",
    applicant: "王洪波（物流调度主管）",
    supplierName: "顺丰速运冷运事业部（顺丰冷运）",
    totalAmount: 750000.0,
    sourceSystem: "OA协同办公系统",
    pushedAt: "2026-09-05 09:15",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 具备全国公路营运资质，车辆温控实时联网接入中控，免检通道快速审核",
    humanReviewNote: "【准予通过】：顺丰冷运属于集团 A 级物流承运商，GPS 全程温控轨迹可追溯，时效承诺与破损赔偿条款合规，准予审批。",
    humanSignOffAt: "2026-09-05 14:40"
  },
  {
    id: "REQ-202609-016",
    caseId: "case-agv-maintenance",
    contractTitle: "第一食品厂工业污水处理站在线监测系统运营维保委托合同",
    contractNo: "ZR-ENV-202609-0021",
    department: "生产设备与动力工程部",
    applicant: "陈长青（装备维护主管）",
    supplierName: "中节能环保装备股份有限公司",
    totalAmount: 320000.0,
    sourceSystem: "OA协同办公系统",
    pushedAt: "2026-09-05 10:20",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 满足生态环境部数据直连要求，服务响应时间≤2小时，维保质保期合规",
    humanReviewNote: "【准予通过】：环保在线监测数据实时上传生态环境部平台，乙方具备环保工程专业承包壹级资质，同意通过。",
    humanSignOffAt: "2026-09-05 15:30"
  },
  {
    id: "REQ-202609-017",
    caseId: "case-filling-line",
    contractTitle: "智能化食品生产线包装X光机与金属异物检测仪批采合同",
    contractNo: "ZR-EQ-202609-0388",
    department: "生产设备与动力工程部",
    applicant: "陈长青（装备维护主管）",
    supplierName: "梅特勒-托利多国际贸易（上海）有限公司",
    totalAmount: 580000.0,
    sourceSystem: "SAP物资主数据平台",
    pushedAt: "2026-09-05 13:10",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 符合生产线 HACCP / FSSC22000 异物防控标准，整机原厂质保 24 个月",
    humanReviewNote: "【准予通过】：检测精度达 Fe 0.4mm / Non-Fe 0.6mm，满足 HACCP 与 FSSC22000 体系认证要求，准予签署。",
    humanSignOffAt: "2026-09-05 16:50"
  },
  {
    id: "REQ-202609-018",
    caseId: "case-food-yeast",
    contractTitle: "2026年度食品全项理化与重金属第三方实验室委托检测服务协议",
    contractNo: "ZR-QC-202609-0128",
    department: "烘焙食品技术研发中心",
    applicant: "李晓雅（品控研发工程师）",
    supplierName: "中国检验认证集团（CCIC）北京有限公司",
    totalAmount: 450000.0,
    sourceSystem: "OA协同办公系统",
    pushedAt: "2026-09-05 14:00",
    riskLevel: "NORMAL",
    status: "APPROVED",
    alertSnippet: "✓ 具备国家法定 CMA/CNAS 计量认证资质，检测周期与保密承诺条款齐备",
    humanReviewNote: "【准予通过】：国字号第三方权威质检机构，具备 CMA 与 CNAS 双重认证资质，出具报告符合国家市场监管抽检要求，准予审批。",
    humanSignOffAt: "2026-09-05 17:30"
  }
];

// 初始化呈批任务池（待办 6 笔 + 真实拟真历史已办结/退回 12 笔，共计 18 笔）
export const INITIAL_PUSH_TASKS: PushTaskItem[] = [
  ...MOCK_CASES.map((c) => c.taskItem),
  ...HISTORICAL_ARCHIVED_TASKS
];
