#!/usr/bin/env node

import fs from 'node:fs';
import path, { dirname } from 'node:path';
import readline from 'node:readline';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = path.join(__dirname, '../package.json');
const packageLockPath = path.join(__dirname, '../package-lock.json');

// 필수 파일 존재 여부 확인
if (!fs.existsSync(packageJsonPath)) {
  throw new Error('❌ package.json 파일을 찾을 수 없습니다.');
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// package-lock.json은 있으면 사용, 없으면 무시
let packageLock = null;
if (fs.existsSync(packageLockPath)) {
  packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  console.log('📦 package-lock.json 파일을 찾았습니다. 함께 업데이트합니다.');
} else {
  console.log('⚠️  package-lock.json 파일이 없습니다. package.json만 업데이트합니다.');
}

const versionType = process.argv[2];

if (
  !versionType ||
  !['major', 'minor', 'patch', 'clear'].includes(versionType)
) {
  console.error('사용법: node version-manager.js [major|minor|patch|clear]');
  console.error('예시: npm run version:major');
  console.error('      npm run version:clear');
  process.exit(1);
}

const generateYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // ex) 25
  const month = String(now.getMonth() + 1).padStart(2, '0'); // ex) 08
  return parseInt(year + month);
};

const parseHeadVersion = version => {
  // version이 없거나 유효하지 않은 경우 기본값 반환
  if (!version || typeof version !== 'string') {
    const currentYearMonth = generateYearMonth();
    return {
      major: 0,
      minor: currentYearMonth,
      patch: 1,
    };
  }

  const parts = version.split('.');
  if (parts.length !== 3) {
    // 초기 버전이 semver 형태가 아니라면 headVersion으로 변환
    const currentYearMonth = generateYearMonth();
    return {
      major: 1,
      minor: currentYearMonth,
      patch: 1,
    };
  }

  return {
    major: parseInt(parts[0]) || 0,
    minor: parseInt(parts[1]) || 0,
    patch: parseInt(parts[2]) || 0,
  };
};

// version 필드가 없으면 기본값 설정
if (!packageJson.version) {
  const currentYearMonth = generateYearMonth();
  packageJson.version = `0.${currentYearMonth}.1`;
  console.log(`⚠️  package.json에 version 필드가 없어 기본값 ${packageJson.version}을 설정했습니다.`);
}

const currentVersion = packageJson.version;

// YYMM 형식의 날짜를 +1개월 후의 YYMM으로 변환
const addOneMonthToYYMM = (yymm) => {
  const year = Math.floor(yymm / 100);
  const month = yymm % 100;
  
  // 12월이면 다음 해 1월로
  if (month === 12) {
    return (year + 1) * 100 + 1;
  } else {
    return year * 100 + (month + 1);
  }
};

// YY 형식을 YYMM 형식으로 변환 (예: 25 -> 2501)
const convertYYToYYMM = (yy) => {
  return yy * 100 + 1; // 1월로 설정
};

const incrementVersion = (current, type) => {
  const parsed = parseHeadVersion(current);
  const currentYearMonth = generateYearMonth();

  switch (type) {
    case 'clear':
      return {
        major: 0,
        minor: currentYearMonth,
        patch: 1,
      };
    case 'major': {
      // major 증가 시: minor를 YYMM 형식으로 변환하여 유지, patch 초기화
      const minorAsYYMM = parsed.minor < 100 ? convertYYToYYMM(parsed.minor) : parsed.minor;
      return {
        major: parsed.major + 1,
        minor: minorAsYYMM,
        patch: 1,
      };
    }
    case 'minor': {
      // minor 증가 시: YYMM 형식으로 +1개월, patch 초기화
      const minorYYMM = parsed.minor < 100 ? convertYYToYYMM(parsed.minor) : parsed.minor;
      return {
        major: parsed.major,
        minor: addOneMonthToYYMM(minorYYMM),
        patch: 1,
      };
    }
    case 'patch':
      // patch 증가
      return {
        major: parsed.major,
        minor: parsed.minor,
        patch: parsed.patch + 1,
      };
    default:
      throw new Error('지원하지 않는 버전 타입입니다.');
  }
};

const formatHeadVersion = versionObj => {
  return `${versionObj.major}.${versionObj.minor}.${versionObj.patch}`;
};

const main = async () => {
  try {
    // clear의 경우 확인 메시지
    if (versionType === 'clear') {
      console.log(`⚠️  현재 버전 ${currentVersion}을(를) 초기화하려고 합니다.`);
      console.log('이 작업은 되돌릴 수 없습니다.');

      // Node.js에서 동기적으로 입력 받기
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise(resolve => {
        rl.question('계속하시겠습니까? (y/N): ', resolve);
      });

      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('버전 초기화가 취소되었습니다.');
        process.exit(0);
      }
    }

    const newVersionObj = incrementVersion(currentVersion, versionType);
    const newVersion = formatHeadVersion(newVersionObj);

    console.log(`현재 버전: ${currentVersion}`);
    console.log(`새 버전: ${newVersion}`);
    console.log(`버전 타입: ${versionType}`);

    // package.json 업데이트
    packageJson.version = newVersion;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
    );

    // // package-lock.json 업데이트 (존재하는 경우에만)
    // if (packageLock) {
    //   packageLock.version = newVersion;
    //   if (packageLock.packages && packageLock.packages['']) {
    //     packageLock.packages[''].version = newVersion;
    //   }
    //   fs.writeFileSync(
    //     packageLockPath,
    //     JSON.stringify(packageLock, null, 2) + '\n',
    //   );
    //   console.log('✅ package.json과 package-lock.json이 성공적으로 업데이트되었습니다.');
    // } else {
    //   console.log('✅ package.json이 성공적으로 업데이트되었습니다.');
    // }

    // Git 커밋 생성 (선택사항)
    try {
      if (packageLock) {
        execSync(`git add package.json package-lock.json`);
      } else {
        execSync(`git add package.json`);
      }
      execSync(`git commit -m "chore: bump version to ${newVersion}"`);
      execSync(`git tag v${newVersion}`);
      console.log(`✅ Git 커밋과 태그(v${newVersion})가 생성되었습니다.`);
    } catch (gitError) {
      console.log(
        '⚠️  Git 커밋/태그 생성 중 오류가 발생했습니다:',
        gitError.message,
      );
      console.log('수동으로 커밋해주세요.');
    }
  } catch (error) {
    console.error('❌ 버전 업데이트 중 오류가 발생했습니다:', error.message);
    process.exit(1);
  }
};

// 메인 함수 실행
main();
