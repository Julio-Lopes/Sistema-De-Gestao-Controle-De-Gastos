using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ControleGastos.API.Models;

namespace ControleGastos.API.Services
{
    /// <summary>
    /// Serviço responsável pela autenticação JWT
    /// Gera tokens e valida credenciais
    /// </summary>
    public class AuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Gera um token JWT para o usuário autenticado
        /// </summary>
        /// <param name="usuario">Usuário que vai receber o token</param>
        /// <returns>Token JWT como string</returns>
        public string GerarToken(Usuario usuario)
        {
            // Chave secreta usada para assinar o token (deve estar no appsettings.json)
            var chaveSecreta = _configuration["Jwt:Key"] 
                ?? throw new InvalidOperationException("Chave JWT não configurada");

            var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveSecreta));
            var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

            // Claims: informações que vão dentro do token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID único do token
            };

            // Configuração do token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],        // Quem emitiu o token
                audience: _configuration["Jwt:Audience"],    // Para quem é o token
                claims: claims,                              // Dados do usuário
                expires: DateTime.UtcNow.AddHours(8),       // Token válido por 8 horas
                signingCredentials: credenciais              // Assinatura para validação
            );

            // Converte o token para string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Cria um hash seguro da senha usando BCrypt
        /// BCrypt é um algoritmo de criptografia forte para senhas
        /// </summary>
        /// <param name="senha">Senha em texto plano</param>
        /// <returns>Hash da senha</returns>
        public string CriarHashSenha(string senha)
        {
            return BCrypt.Net.BCrypt.HashPassword(senha);
        }

        /// <summary>
        /// Verifica se a senha informada corresponde ao hash armazenado
        /// </summary>
        /// <param name="senha">Senha em texto plano</param>
        /// <param name="senhaHash">Hash armazenado no banco</param>
        /// <returns>True se a senha está correta</returns>
        public bool VerificarSenha(string senha, string senhaHash)
        {
            return BCrypt.Net.BCrypt.Verify(senha, senhaHash);
        }
    }
}