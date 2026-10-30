function getEnv(name: string): string {
	const value = process.env[name]
	if (value) {
		return value
	}
	console.log(`Could not find ${name} in .env file.`)
	process.exit(1)
}

export function getPort(): number {
	return Number(getEnv('PORT'))
}

export function getAwsConfig() {
	return {
		region: getEnv('AWS_REGION'),
		credentials: {
			accessKeyId: getEnv('ACCESS_KEY'),
			secretAccessKey: getEnv('SECRET_ACCESS_KEY')
		}
	}
}

export function getTableName(): string {
	return getEnv('TABLE_NAME')
}

export function getJwtSecret(): string {
	return getEnv('JWT_SECRET')
}