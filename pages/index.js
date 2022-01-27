import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import appConfig from '../config.json'
import { Box, Button, Text, TextField, Image } from '@skynexui/components'

function Title(props) {
	const Tag = props.tag || 'h1'
	return (
		<>
			<Tag>{props.children}</Tag>
			<style jsx>{`
				${Tag} {
					color: ${appConfig.theme.colors.neutrals['000']};
					font-size: 24px;
					font-weight: 600;
				}
			`}</style>
		</>
	)
}

function Background() {
	return (
		<>
			<video autoPlay muted loop>
				<source src="/matrix.mp4" type="video/mp4" />
			</video>
			<style jsx>{`
				video {
					position: absolute;
					z-index: -100;
					width: 100vw;
					height: 100vh;
					object-fit: cover;
				}
			`}</style>
		</>
	)
}

export default function HomePage() {
	const [username, setUsername] = useState('')
	const router = useRouter()

	const handleUsername = value => {
		setUsername(value)
	}

	return (
		<>
			<Background />
			<Box
				styleSheet={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Box
					styleSheet={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						maxWidth: '500px',
						borderRadius: '5px',
						padding: '32px',
						margin: '16px',
						boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
						backgroundColor: appConfig.theme.colors.neutrals[700],
					}}
				>
					{/* Formulário */}
					<Box
						as="form"
						onSubmit={e => {
							e.preventDefault()
							router.push(`/chat?username=${username}`)
						}}
						styleSheet={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							textAlign: 'center',
							marginBottom: '32px',
						}}
					>
						<Title tag="h2">Boas vindas de volta!</Title>
						<Text
							variant="body3"
							styleSheet={{
								marginBottom: '32px',
								color: appConfig.theme.colors.neutrals[300],
							}}
						>
							{appConfig.name}
						</Text>

						<TextField
							onChange={e => handleUsername(e.target.value)}
							fullWidth
							placeholder='Usuário do Github'
							textFieldColors={{
								neutral: {
									textColor: appConfig.theme.colors.neutrals[200],
									mainColor: appConfig.theme.colors.neutrals[900],
									mainColorHighlight: appConfig.theme.colors.primary[500],
									backgroundColor: appConfig.theme.colors.neutrals[800],
								},
							}}
						/>
						<Button
							type="submit"
							label="Entrar"
							fullWidth
							buttonColors={{
								contrastColor: appConfig.theme.colors.neutrals['000'],
								mainColor: appConfig.theme.colors.primary[500],
								mainColorLight: appConfig.theme.colors.primary[400],
								mainColorStrong: appConfig.theme.colors.primary[600],
							}}
						/>
					</Box>
					{/* Formulário */}
				</Box>
			</Box>
		</>
	)
}
