const fs = require('fs');

// Get the filename from the command-line arguments
const inputFileName = process.argv[2];
const outputFileName = process.argv[3] || '../report/snyk-report.json'; // Default output filename if not provided

if (!inputFileName) {
  console.error('Please provide the input file name.');
  process.exit(1);
}

// Load the Snyk JSON file
const snykData = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));

// Create an array to store the filtered issues
const filteredIssues = snykData.vulnerabilities.map(vuln => ({
  Severity: vuln.severity,
  Attacks: vuln.identifiers?.CWE || [],
  'Vulnerable package': vuln.packageName,
  'Upgrade to': vuln.fixedIn || [],
  Reference: vuln.references ? vuln.references.map(ref => ref.url) : []
}));

// Save the filtered data to a new JSON file
fs.writeFileSync(outputFileName, JSON.stringify(filteredIssues, null, 2));

console.log(`Filtered Snyk data saved to ${outputFileName}`);
