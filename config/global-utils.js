export const c =
  "https://camo.githubusercontent.com/e8801c915c6aef37567a907c70a535ca95335c2d490a3340d06bba439a1ed005/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f736e796b2f696d6167652f75706c6f61642f775f32302c685f32302f76313536313937373831392f69636f6e2f632e706e67";
export const h =
  "https://camo.githubusercontent.com/9d51f28c19d68a26a2a08210e149d8afec20f84af0925bd9aedbd406c56cad72/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f736e796b2f696d6167652f75706c6f61642f775f32302c685f32302f76313536313937373831392f69636f6e2f682e706e67";
export const m =
  "https://camo.githubusercontent.com/87ff89b4b8f94ce578fb7cf68651203196e42036bb7052c0e196850e22f8d2c9/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f736e796b2f696d6167652f75706c6f61642f775f32302c685f32302f76313536313937373831392f69636f6e2f6d2e706e67";
export const l =
  "https://camo.githubusercontent.com/f2ab3e2f2bf334b038843bd4f736d6182625fc72809c7ad3c8504b54444f2128/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f736e796b2f696d6167652f75706c6f61642f775f32302c685f32302f76313536313937373831392f69636f6e2f6c2e706e67";
export const footer = `Please consider investigating the findings and remediating the incidents. Failure to do so may lead to compromising the associated services or software components.`;

export function checkStringContains(string, substring) {
  const regex = new RegExp(substring, "i");
  return regex.test(string);
}

export function getCurrentUser(context) {
    const pr = context.payload.pull_request;
    return pr.user.login;
}

export function parseLogOutput(logOutput, substring) {
  var startMarker = "",
    endMarker = "",
    comments = "";

  if (substring === "snyk") {
    startMarker = "Testing /home/runner/work/";
    endMarker = "Organization:";

    var snykLogSection = getPartofLog(startMarker, endMarker, logOutput);

    var snykLogLi = snykLogSection.split("\n");
    snykLogLi.splice(0, 2);
    var snykPrCmt = snykLogLi.join("\n");

    // var snykcmt = `Tested 30 dependencies for known issues, found 14 issues, 15 vulnerable paths.


    //   Issues to fix by upgrading:
      
    //     Upgrade chalk@1.1.3 to chalk@2.0.0 to fix
    //     ✗ Regular Expression Denial of Service (ReDoS) [Critical Severity][https://security.snyk.io/vuln/SNYK-JS-ANSIREGEX-1583908] in ansi-regex@2.1.1
    //       introduced by chalk@1.1.3 > has-ansi@2.0.0 > ansi-regex@2.1.1 and 1 other path(s)
      
    //     Upgrade debug@2.2.0 to debug@2.6.9 to fix
    //     ✗ Regular Expression Denial of Service (ReDoS) [Low Severity][https://security.snyk.io/vuln/npm:debug:20170905] in debug@2.2.0
    //       introduced by debug@2.2.0
    //     ✗ Regular Expression Denial of Service (ReDoS) [Low Severity][https://security.snyk.io/vuln/npm:ms:20170412] in ms@0.7.1
    //       introduced by debug@2.2.0 > ms@0.7.1
      
    //     Upgrade hoek@2.16.3 to hoek@4.2.1 to fix
    //     ✗ Prototype Pollution [Medium Severity][https://security.snyk.io/vuln/npm:hoek:20180212] in hoek@2.16.3
    //       introduced by hoek@2.16.3
      
    //     Upgrade lodash@3.10.1 to lodash@4.17.21 to fix
    //     ✗ Regular Expression Denial of Service (ReDoS) [Medium Severity][https://security.snyk.io/vuln/SNYK-JS-LODASH-1018905] in lodash@3.10.1
    //       introduced by lodash@3.10.1
    //     ✗ Regular Expression Denial of Service (ReDoS) [Medium Severity][https://security.snyk.io/vuln/SNYK-JS-LODASH-73639] in lodash@3.10.1
    //       introduced by lodash@3.10.1
    //     ✗ Prototype Pollution [Medium Severity][https://security.snyk.io/vuln/npm:lodash:20180130] in lodash@3.10.1
    //       introduced by lodash@3.10.1
    //     ✗ Command Injection [High Severity][https://security.snyk.io/vuln/SNYK-JS-LODASH-1040724] in lodash@3.10.1
    //       introduced by lodash@3.10.1
    //     ✗ Prototype Pollution [High Severity][https://security.snyk.io/vuln/SNYK-JS-LODASH-608086] in lodash@3.10.1
    //       introduced by lodash@3.10.1
    //     ✗ Prototype Pollution [High Severity][https://security.snyk.io/vuln/SNYK-JS-LODASH-450202] in lodash@3.10.1
    //       introduced by lodash@3.10.1
    //     ✗ Prototype Pollution [High Severity][https://security.snyk.io/vuln/SNYK-JS-LODASH-73638] in lodash@3.10.1
    //       introduced by lodash@3.10.1
      
    //     Upgrade minimist@0.0.10 to minimist@0.2.4 to fix
    //     ✗ Prototype Pollution [Low Severity][https://security.snyk.io/vuln/SNYK-JS-MINIMIST-2429795] in minimist@0.0.10
    //       introduced by minimist@0.0.10
    //     ✗ Prototype Pollution [Medium Severity][https://security.snyk.io/vuln/SNYK-JS-MINIMIST-559764] in minimist@0.0.10
    //       introduced by minimist@0.0.10
      
    //     Upgrade tough-cookie@2.3.4 to tough-cookie@4.1.3 to fix
    //     ✗ Prototype Pollution (new) [Medium Severity][https://security.snyk.io/vuln/SNYK-JS-TOUGHCOOKIE-5672873] in tough-cookie@2.3.4
    //       introduced by tough-cookie@2.3.4
      
      
      
    //   `;
    comments = generateSnykComment(snykPrCmt);
  } else if (substring === "truffle") {
    startMarker =
      'info-0	thog/scanner	resolved common merge base between references	{"pid":';
    endMarker = 'info-0	thog/scanner	finished scanning commits	{"pid":';

    var truffleLogSection = getPartofLog(startMarker, endMarker, logOutput);
    truffleLogSection = truffleLogSection.replace(/\/\s+/g, "")

    var truffleLogLi = truffleLogSection.split("\n")
    truffleLogLi.splice(0, 1);
    var trufflePrCmt = truffleLogLi.join("\n")

    trufflePrCmt = trufflePrCmt.replace(/ Found verified result 🐷🔑/g, "")
    trufflePrCmt = trufflePrCmt.split("\n")
    trufflePrCmt = trufflePrCmt.filter(
      (str) =>
        str !== "" &&
        !str.includes("Timestamp") &&
        !str.includes("Repository") &&
        !str.includes("Email") &&
        str.includes(":")
    );
    trufflePrCmt.pop();

    const objects = [];

    for (let i = 0; i < trufflePrCmt.length; i += 5) {
      const obj = {};
      for (let j = 0; j < 5 && i + j < trufflePrCmt.length; j++) {
        const str = trufflePrCmt[i + j];
        const colonIndex = str.indexOf(": ");
        const beforeColon = str.substring(0, colonIndex).trim();
        const afterColon = str.substring(colonIndex + 1).trim();

        obj[beforeColon] = afterColon;
      }
      objects.push(obj);
    }
    comments = generateTruffleTable(objects);
  }
  return comments;
}

export function generateTruffleTable(data) {
  let table = `<details>
    <summary style="cursor:pointer;outline: none;">
    <h4>🔎 Detected hardcoded secrets in your pull request</h4>
    </summary><table>\n`;

  // Secrets Table header
  table += "<tr>\n";
  for (const key in data[0]) {
    table += `<th>${key}</th>\n`;
  }
  table += "</tr>\n";
  // Secrets Line Items- Table Rows
  data.forEach((obj) => {
    table += "<tr>\n";
    for (const key in obj) {
      table += `<td>${obj[key]}</td>\n`;
    }
    table += "</tr>\n";
  });
  table += "</table></details>";
  return table;
}

export function generateSnykComment(data) {

  var commentData = snykDataSanity(data);
  let critical = 0,
    high = 0,
    medium = 0,
    low = 0;
  critical = (data.match(/Critical/g) || []).length;
  high = (data.match(/High/g) || []).length;
  medium = (data.match(/Medium/g) || []).length;
  low = (data.match(/Low/g) || []).length;

  let h1 = "<h4>" + data.substr(0, data.indexOf("\n")) + "</h4>";
  let headerCount = `<table>
    <tr>
    <th><img src ="${c}" alt="Critical" width="20" height="20"/><br><p>Critical</p></th>
    <th><img src ="${h}" alt="High" width="20" height="20"/><br><p>High</p></th>
    <th><img src ="${m}" alt="Medium" width="20" height="20"/><br><p>Medium</p></th>
    <th><img src ="${l}" alt="Low" width="20" height="20"/><br><p>Low</p></th>
    </tr>
    <tr>
    <td><strong>${critical}</strong></td>
    <td><strong>${high}</strong></td>
    <td><strong>${medium}</strong></td>
    <td><strong>${low}</strong></td>
    </tr>
    </table>
    <details>
    <summary style="cursor:pointer;outline: none;">
    <h4>Vulnerabilities that will be fixed with an upgrade:</h4>
    </summary>`;
  var snykComment = h1 + headerCount + commentData;
  return snykComment;
}

export function snykDataSanity(data) {
  var snykData = data.replace(/(^[ \t]*\n)/gm, "");

  var li = snykData.split("\n");
  li.splice(0, 2);

  var cmt = li.join("\n");
  cmt = cmt.split("\n");
  cmt = cmt.filter((str) => str.includes("✗") || str.includes("Upgrade"));

  var values = convertSnykJSON(cmt.join("\n"));

  return values;
}

export function convertSnykJSON(text) {
  const lines = text.split("\n");
  const result = [];
  var pkg = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("Upgrade")) {
      result.push(line);
      pkg = line;
    } else if (line.startsWith("✗")) {
      const vulnerability = {
        severity: line.substring(
          line.indexOf("[") + 1,
          line.indexOf(" Severity]")
        ),
        attack: line.substring(line.indexOf("✗ ") + 1, line.indexOf("[")),
        package: line.substring(line.indexOf("] in ") + 5, line.length),
        upgrade: pkg.substring(pkg.indexOf(" to ") + 4, pkg.indexOf(" to fix")),
        link: line.substring(line.indexOf("][") + 2, line.indexOf("] in")),
      };
      const previousEntry = result[result.length - 1];

      if (typeof previousEntry === "string") {
        result[result.length - 1] = { vulnerabilities: [vulnerability] };
      } else {
        previousEntry.vulnerabilities.push(vulnerability);
      }
    }
  }

  const vulnerabilitiesArray = result.reduce((arrres, item) => {
    return arrres.concat(item.vulnerabilities);
  }, []);

  vulnerabilitiesArray.sort((a, b) => {
    const severityOrder = {
      Critical: 0,
      High: 1,
      Medium: 2,
      Low: 3,
    };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return convertSnykTable(vulnerabilitiesArray);
}

export function convertSnykTable(jsonData) {
  let tableHtml = `<table><tr>
    <th>Severity</th>
    <th>Attacks</th>
    <th>Vulnerable package</th>
    <th>Ugrade to</th>
    <th>Reference</th>
    </tr>`;

  for (let i = 0; i < jsonData.length; i++) {
    if (typeof jsonData[i] === "object") {
      const vulnerability = jsonData[i];
      var imgsrc =
        vulnerability.severity === "Critical"
          ? c
          : vulnerability.severity === "High"
          ? h
          : vulnerability.severity === "Medium"
          ? m
          : l;
      tableHtml += `
            <tr>
              <td><img src ="${imgsrc}" alt="${vulnerability.severity}" width="20" height="20"/></td>
              <td>${vulnerability.attack}</td>
              <td>${vulnerability.package}</td>
              <td>${vulnerability.upgrade}</td>
              <td><strong><a href="${vulnerability.link}">Snyk Link</a></strong></td>
            </tr>`;
    }
  }
  tableHtml += "</table> </details>";
  return tableHtml;
}

export function getPartofLog(startMarker, endMarker, logOutput) {
  // Extract the desired part of the log output 
  const lines = logOutput.split("\n");
  logOutput = lines
    .map((line) =>
      line.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+)Z/g, "")
    )
    .join("\n");

  const startIndex = logOutput.indexOf(startMarker);
  const endIndex = logOutput.indexOf(endMarker);
  var logSection = logOutput.substring(
    startIndex + startMarker.length,
    endIndex
  );
  return logSection;
}