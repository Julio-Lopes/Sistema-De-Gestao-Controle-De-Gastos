using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastos.API.Data;
using ControleGastos.API.DTOs;
using ControleGastos.API.Models;
using ControleGastos.API.Services;

namespace ControleGastos.API.Controllers
{
    /// <summary>
    /// Controller responsável pela autenticação (login e registro)
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AuthController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        /// <summary>
        /// POST api/auth/registro
        /// Registra um novo usuário no sistema
        /// </summary>
        [HttpPost("registro")]
        public async Task<ActionResult<AuthResponseDTO>> Registro([FromBody] RegistroRequestDTO request)
        {
            // Validar se o ModelState está válido (validações dos DataAnnotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar se já existe um usuário com esse email
            var usuarioExistente = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuarioExistente != null)
            {
                return BadRequest(new { message = "Email já cadastrado" });
            }

            // Criar novo usuário com senha criptografada
            var novoUsuario = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                SenhaHash = _authService.CriarHashSenha(request.Senha),
                DataCriacao = DateTime.UtcNow
            };

            // Salvar no banco de dados
            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();

            // Gerar token JWT para o novo usuário
            var token = _authService.GerarToken(novoUsuario);

            // Retornar resposta com dados do usuário e token
            return Ok(new AuthResponseDTO
            {
                Id = novoUsuario.Id,
                Nome = novoUsuario.Nome,
                Email = novoUsuario.Email,
                Token = token
            });
        }

        /// <summary>
        /// POST api/auth/login
        /// Faz login de um usuário existente
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginRequestDTO request)
        {
            // Validar ModelState
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Buscar usuário pelo email
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // Se não encontrou o usuário ou senha está incorreta
            if (usuario == null || !_authService.VerificarSenha(request.Senha, usuario.SenhaHash))
            {
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            // Gerar token JWT
            var token = _authService.GerarToken(usuario);

            // Retornar resposta com dados do usuário e token
            return Ok(new AuthResponseDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Token = token
            });
        }
    }
}