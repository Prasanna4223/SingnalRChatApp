# Use the official .NET SDK image to build and publish the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
 
# Copy csproj and restore
COPY *.csproj ./
RUN dotnet restore
 
# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out
 
# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
 
# Bind to port from environment variable
ENV ASPNETCORE_URLS=http://+:$PORT
EXPOSE 10000
 
ENTRYPOINT ["dotnet", "SignalRChatApplication.dll"]
