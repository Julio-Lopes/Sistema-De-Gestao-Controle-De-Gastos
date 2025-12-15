using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ControleGastos.API.Data;
using ControleGastos.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== CONFIGURAÇÃO DO BANCO DE DADOS =====
// Conectar ao MySQL usando Pomelo
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ===== CONFIGURAÇÃO DO JWT =====
// Obter configurações do appsettings.json
var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? throw new InvalidOperationException("JWT Key não configurada");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

// Adicionar autenticação JWT
builder.Services.AddAuthentication(options =>
{
    // Definir JWT como esquema padrão
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Configurar validação do token
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,              // Validar quem emitiu
        ValidateAudience = true,            // Validar para quem é
        ValidateLifetime = true,            // Validar se não expirou
        ValidateIssuerSigningKey = true,    // Validar assinatura
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero           // Não adicionar tempo extra de tolerância
    };
});

// ===== REGISTRAR SERVIÇOS =====
builder.Services.AddScoped<AuthService>(); // Serviço de autenticação

// ===== CONFIGURAÇÃO DE CONTROLLERS =====
builder.Services.AddControllers();

// ===== CONFIGURAÇÃO DO SWAGGER =====
// Swagger é a documentação automática da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Controle de Gastos API",
        Version = "v1",
        Description = "API para gerenciar gastos residenciais com autenticação JWT"
    });

    // Adicionar suporte a JWT no Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando Bearer scheme. Exemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ===== CONFIGURAÇÃO DO CORS =====
// Permitir que o frontend React acesse a API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // URLs do React
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ===== PIPELINE DE REQUISIÇÕES =====

// Usar Swagger apenas em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: A ordem importa!
app.UseCors("AllowFrontend");     // 1. CORS primeiro
app.UseAuthentication();           // 2. Autenticação (valida token)
app.UseAuthorization();            // 3. Autorização (verifica permissões)

app.MapControllers();

// Mensagem de inicialização
Console.WriteLine("===========================================");
Console.WriteLine("🚀 API de Controle de Gastos Iniciada!");
Console.WriteLine("📚 Swagger: http://localhost:5013/swagger");
Console.WriteLine("===========================================");

app.Run();