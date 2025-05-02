// import { expect } from "chai";

// import ScoreService from "../services/score/Score.Service";
// import { URLScanReportType, VirustotalReportType } from "../types/Types";

// describe("ScoreService", () => {
//   let service: ScoreService;

//   beforeEach(() => {
//     service = new ScoreService();
//   });

//   it("should return 100 for clean reports", () => {
//     const vt: VirustotalReportType = {
//       stats: {
//         malicious: 0,
//         suspicious: 0,
//         timeout: 0,
//         harmless: 10,
//         undetected: 10
//       },
//       antivirusResults: {
//         Avast: { result: "clean" },
//         Bitdefender: { result: "unrated" }
//       }
//     };

//     const us: URLScanReportType = {
//       page: { country: "US", visibility: "private" },
//       verdicts: { overall: { malicious: false, tags: ["secure"] } },
//       lists: { linkDomains: ["safe.com"] },
//       stats: { ipCount: 2 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(100);
//   });

//   it("should penalize malicious virustotal results", () => {
//     const vt: VirustotalReportType = {
//       stats: {
//         malicious: 5,
//         suspicious: 2,
//         timeout: 1,
//         harmless: 0,
//         undetected: 0
//       },
//       antivirusResults: {
//         A1: { result: "malware" },
//         A2: { result: "trojan" },
//         A3: { result: "ransom" },
//         A4: { result: "phishing" },
//         A5: { result: "rootkit" },
//         A6: { result: "worm" }
//       }
//     };

//     const us: URLScanReportType = {
//       page: { country: "US", visibility: "private" },
//       verdicts: { overall: { malicious: false, tags: [] } },
//       lists: { linkDomains: [] },
//       stats: { ipCount: 1 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(65);
//   });

//   it("should penalize malicious urlscan verdict", () => {
//     const vt: VirustotalReportType = {
//       stats: {
//         malicious: 0,
//         suspicious: 0,
//         timeout: 0,
//         harmless: 0,
//         undetected: 0
//       },
//       antivirusResults: {}
//     };

//     const us: URLScanReportType = {
//       page: { country: "RU", visibility: "public" },
//       verdicts: { overall: { malicious: true, tags: [] } },
//       lists: {
//         linkDomains: Array(40).fill("tracker.com")
//       },
//       stats: { ipCount: 12 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(55.5);
//   });

//   it("should clamp score to 0 for very bad data", () => {
//     const vt: VirustotalReportType = {
//       stats: {
//         malicious: 30,
//         suspicious: 10,
//         timeout: 5,
//         harmless: 0,
//         undetected: 0
//       },
//       antivirusResults: {
//         E1: { result: "malware" },
//         E2: { result: "ransom" },
//         E3: { result: "phishing" },
//         E4: { result: "trojan" },
//         E5: { result: "spyware" },
//         E6: { result: "adware" }
//       }
//     };

//     const us: URLScanReportType = {
//       page: { country: "KP", visibility: "public" },
//       verdicts: { overall: { malicious: true, tags: [] } },
//       lists: {
//         linkDomains: Array(50).fill("malicious.com")
//       },
//       stats: { ipCount: 20 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(0);
//   });

//   // 🌟 EDGE CASES

//   it("should handle missing stats or antivirus results gracefully", () => {
//     const vt = {} as VirustotalReportType;
//     const us = {} as URLScanReportType;
//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(100); // no penalty applied
//   });

//   it("should not penalize if antivirus engines are clean/unrated only", () => {
//     const vt: VirustotalReportType = {
//       stats: { malicious: 0, suspicious: 0, timeout: 0, harmless: 0, undetected: 0 },
//       antivirusResults: {
//         Engine1: { result: "clean" },
//         Engine2: { result: "unrated" }
//       }
//     };

//     const us: URLScanReportType = {
//       page: { country: "", visibility: "" },
//       verdicts: { overall: { malicious: false, tags: [] } },
//       lists: { linkDomains: [] },
//       stats: { ipCount: 0 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(100);
//   });

//   it("should apply bonus score only once even if multiple 'secure' tags", () => {
//     const vt: VirustotalReportType = {
//       stats: { malicious: 0, suspicious: 0, timeout: 0, harmless: 0, undetected: 0 },
//       antivirusResults: {}
//     };

//     const us: URLScanReportType = {
//       page: { country: "IN", visibility: "private" },
//       verdicts: { overall: { malicious: false, tags: ["secure", "secure", "secure"] } },
//       lists: { linkDomains: [] },
//       stats: { ipCount: 1 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(100); // secure bonus applied only once
//   });

//   it("should handle mixed case country/visibility fields", () => {
//     const vt: VirustotalReportType = {
//       stats: { malicious: 0, suspicious: 0, timeout: 0, harmless: 0, undetected: 0 },
//       antivirusResults: {}
//     };

//     const us: URLScanReportType = {
//       page: { country: "cN", visibility: "UnLiStEd" },
//       verdicts: { overall: { malicious: false, tags: [] } },
//       lists: { linkDomains: [] },
//       stats: { ipCount: 0 }
//     };

//     const score = service.CalculateScore(vt, us);
//     expect(score).to.equal(85); // -10 for CN + -5 for unlisted
//   });
// });
