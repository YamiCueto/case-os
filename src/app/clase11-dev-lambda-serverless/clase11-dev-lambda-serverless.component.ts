import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clase11-dev-lambda-serverless',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clase11-dev-lambda-serverless.component.html',
  styleUrls: ['./clase11-dev-lambda-serverless.component.css', '../shared-presentation.css']
})
export class Clase11DevLambdaServerlessComponent {
  currentSlide = 0;

  titleSlide = {
    icon: '⚡',
    title: 'Serverless con AWS Lambda',
    subtitle: 'Node.js + TypeScript + AWS SAM',
    description: 'Aprende a crear funciones Lambda serverless para procesamiento asíncrono escalable en AWS.'
  };

  context = {
    title: 'Contexto: ¿Por qué Serverless?',
    scenario: {
      icon: '☁️',
      text: 'Necesitamos procesar archivos CSV de transacciones bancarias de forma asíncrona y escalable sin gestionar servidores.'
    },
    benefits: [
      {
        icon: '💰',
        title: 'Pay per Use',
        description: 'Solo pagas por el tiempo de ejecución real, sin costos de servidores inactivos',
        color: 'green'
      },
      {
        icon: '📈',
        title: 'Auto-scaling',
        description: 'Escala automáticamente de 0 a miles de ejecuciones concurrentes',
        color: 'blue'
      },
      {
        icon: '🔧',
        title: 'Zero Maintenance',
        description: 'AWS gestiona servidores, parches, alta disponibilidad y escalado',
        color: 'purple'
      },
      {
        icon: '⚡',
        title: 'Event-driven',
        description: 'Se ejecuta en respuesta a eventos (S3, API Gateway, DynamoDB, etc.)',
        color: 'orange'
      }
    ]
  };

  setup = {
    title: 'Setup del Proyecto Serverless',
    installation: {
      titulo: 'Instalación de Herramientas',
      code: `# Instalar AWS SAM CLI (Windows con Chocolatey)
choco install aws-sam-cli

# O descargar instalador desde:
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# Verificar instalación
sam --version

# Configurar credenciales AWS
aws configure
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region: us-east-1

# Instalar dependencias Node.js
npm install -g typescript ts-node
npm install --save-dev @types/node @types/aws-lambda`
    },
    projectInit: {
      titulo: 'Inicializar Proyecto SAM',
      code: `# Crear proyecto con SAM
sam init

# Seleccionar opciones:
# 1 - AWS Quick Start Templates
# 1 - Hello World Example
# N - No Python
# nodejs18.x
# transaction-processor
# Y - X-Ray tracing

# Estructura generada:
transaction-processor/
├── template.yaml          # CloudFormation template
├── src/
│   └── handlers/
│       └── process-transaction.ts
├── events/
│   └── s3-event.json     # Test events
├── tests/
├── tsconfig.json
└── package.json`
    },
    dependencies: {
      titulo: 'Dependencias del Proyecto',
      code: `// package.json
{
  "name": "transaction-processor",
  "version": "1.0.0",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.450.0",
    "@aws-sdk/client-dynamodb": "^3.450.0",
    "@aws-sdk/lib-dynamodb": "^3.450.0",
    "@aws-sdk/client-sns": "^3.450.0",
    "csv-parser": "^3.0.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/aws-lambda": "^8.10.130",
    "@types/node": "^20.10.0",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "ts-jest": "^29.1.1"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`
    }
  };

  lambdaHandler = {
    title: 'Lambda Handler Principal',
    description: 'Función que procesa archivos CSV desde S3',
    handler: {
      titulo: 'Handler con TypeScript',
      code: `// src/handlers/process-transaction.ts
import { S3Event, Context } from 'aws-lambda';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';

// Configuración de clientes AWS
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamoClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

// Environment variables
const TABLE_NAME = process.env.TABLE_NAME!;
const PROCESSED_BUCKET = process.env.PROCESSED_BUCKET!;
const ERROR_BUCKET = process.env.ERROR_BUCKET!;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

interface Transaction {
  id: string;
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  fecha: string;
  descripcion: string;
  timestamp: number;
}

interface ProcessResult {
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: Array<{ line: number; error: string }>;
}

export const handler = async (
  event: S3Event,
  context: Context
): Promise<void> => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\\+/g, ' '));

  console.log(\`Processing file: s3://\${bucket}/\${key}\`);

  try {
    // 1. Leer archivo desde S3
    const transactions = await readTransactionsFromS3(bucket, key);
    console.log(\`Read \${transactions.length} transactions\`);

    // 2. Validar transacciones
    const validationResult = validateTransactions(transactions);

    if (validationResult.errors.length > 0) {
      console.error('Validation errors:', validationResult.errors);
      await moveToErrorBucket(bucket, key);
      throw new Error(\`File has \${validationResult.errors.length} validation errors\`);
    }

    // 3. Guardar en DynamoDB (en lotes de 25)
    await saveToDynamoDB(transactions);
    console.log('Successfully saved to DynamoDB');

    // 4. Publicar evento a SNS
    await publishToSNS({
      totalRecords: transactions.length,
      successfulRecords: transactions.length,
      failedRecords: 0,
      errors: []
    });

    // 5. Mover archivo a bucket procesado
    await moveToProcessedBucket(bucket, key);
    console.log('File moved to processed bucket');

  } catch (error) {
    console.error('Error processing file:', error);

    // Mover a bucket de errores
    try {
      await moveToErrorBucket(bucket, key);
    } catch (moveError) {
      console.error('Error moving file to error bucket:', moveError);
    }

    throw error;
  }
};`
    },
    helpers: {
      titulo: 'Funciones Helper',
      code: `async function readTransactionsFromS3(
  bucket: string,
  key: string
): Promise<Transaction[]> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);

  return new Promise((resolve, reject) => {
    const transactions: Transaction[] = [];
    const stream = response.Body as Readable;

    stream
      .pipe(csvParser())
      .on('data', (row: any) => {
        transactions.push({
          id: uuidv4(),
          cuentaOrigen: row.cuenta_origen,
          cuentaDestino: row.cuenta_destino,
          monto: parseFloat(row.monto),
          fecha: row.fecha,
          descripcion: row.descripcion,
          timestamp: Date.now()
        });
      })
      .on('end', () => resolve(transactions))
      .on('error', reject);
  });
}

function validateTransactions(
  transactions: Transaction[]
): ProcessResult {
  const errors: Array<{ line: number; error: string }> = [];

  transactions.forEach((tx, index) => {
    const line = index + 2; // +2 for header and 0-index

    // Validar monto
    if (isNaN(tx.monto) || tx.monto <= 0) {
      errors.push({ line, error: 'Monto inválido' });
    }

    if (tx.monto > 1000000) {
      errors.push({ line, error: 'Monto supera límite de 1M' });
    }

    // Validar cuentas
    if (!tx.cuentaOrigen || !tx.cuentaDestino) {
      errors.push({ line, error: 'Cuentas origen/destino requeridas' });
    }

    // Validar fecha
    if (!isValidDate(tx.fecha)) {
      errors.push({ line, error: 'Fecha inválida' });
    }
  });

  return {
    totalRecords: transactions.length,
    successfulRecords: transactions.length - errors.length,
    failedRecords: errors.length,
    errors
  };
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

async function saveToDynamoDB(
  transactions: Transaction[]
): Promise<void> {
  // DynamoDB BatchWrite límite: 25 items
  const batchSize = 25;

  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);

    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: batch.map(tx => ({
          PutRequest: {
            Item: tx
          }
        }))
      }
    });

    await dynamoClient.send(command);
  }
}

async function publishToSNS(result: ProcessResult): Promise<void> {
  const message = {
    timestamp: new Date().toISOString(),
    result,
    status: result.errors.length === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS'
  };

  const command = new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Message: JSON.stringify(message),
    Subject: 'Transaction Processing Result'
  });

  await snsClient.send(command);
}

async function moveToProcessedBucket(
  sourceBucket: string,
  sourceKey: string
): Promise<void> {
  const destinationKey = sourceKey.replace('input/', 'processed/');

  // Copiar archivo
  await s3Client.send(new CopyObjectCommand({
    CopySource: \`\${sourceBucket}/\${sourceKey}\`,
    Bucket: PROCESSED_BUCKET,
    Key: destinationKey
  }));

  // Eliminar original
  await s3Client.send(new DeleteObjectCommand({
    Bucket: sourceBucket,
    Key: sourceKey
  }));
}

async function moveToErrorBucket(
  sourceBucket: string,
  sourceKey: string
): Promise<void> {
  const destinationKey = sourceKey.replace('input/', 'error/');

  await s3Client.send(new CopyObjectCommand({
    CopySource: \`\${sourceBucket}/\${sourceKey}\`,
    Bucket: ERROR_BUCKET,
    Key: destinationKey
  }));

  await s3Client.send(new DeleteObjectCommand({
    Bucket: sourceBucket,
    Key: sourceKey
  }));
}`
    }
  };

  samTemplate = {
    title: 'Infraestructura como Código (SAM)',
    description: 'Definición de recursos AWS con CloudFormation',
    template: {
      titulo: 'template.yaml',
      code: `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Transaction Processing Lambda

Globals:
  Function:
    Timeout: 300
    MemorySize: 512
    Runtime: nodejs18.x
    Architectures:
      - x86_64
    Tracing: Active
    Environment:
      Variables:
        NODE_ENV: production

Resources:
  # Lambda Function
  TransactionProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: dist/
      Handler: handlers/process-transaction.handler
      Description: Process CSV transaction files from S3
      Environment:
        Variables:
          TABLE_NAME: !Ref TransactionsTable
          PROCESSED_BUCKET: !Ref ProcessedBucket
          ERROR_BUCKET: !Ref ErrorBucket
          SNS_TOPIC_ARN: !Ref TransactionsTopic
      Policies:
        - S3ReadPolicy:
            BucketName: !Ref InputBucket
        - S3CrudPolicy:
            BucketName: !Ref ProcessedBucket
        - S3CrudPolicy:
            BucketName: !Ref ErrorBucket
        - DynamoDBCrudPolicy:
            TableName: !Ref TransactionsTable
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt TransactionsTopic.TopicName
      Events:
        S3Event:
          Type: S3
          Properties:
            Bucket: !Ref InputBucket
            Events: s3:ObjectCreated:*
            Filter:
              S3Key:
                Rules:
                  - Name: prefix
                    Value: input/
                  - Name: suffix
                    Value: .csv

  # S3 Buckets
  InputBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${AWS::StackName}-input-\${AWS::AccountId}'
      VersioningConfiguration:
        Status: Enabled
      LifecycleConfiguration:
        Rules:
          - Id: DeleteOldFiles
            Status: Enabled
            ExpirationInDays: 30

  ProcessedBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${AWS::StackName}-processed-\${AWS::AccountId}'
      LifecycleConfiguration:
        Rules:
          - Id: ArchiveOldFiles
            Status: Enabled
            Transitions:
              - StorageClass: GLACIER
                TransitionInDays: 90

  ErrorBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${AWS::StackName}-error-\${AWS::AccountId}'

  # DynamoDB Table
  TransactionsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '\${AWS::StackName}-transactions'
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
        - AttributeName: fecha
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: FechaIndex
          KeySchema:
            - AttributeName: fecha
              KeyType: HASH
          Projection:
            ProjectionType: ALL
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES

  # SNS Topic
  TransactionsTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: !Sub '\${AWS::StackName}-notifications'
      DisplayName: Transaction Processing Notifications

  # CloudWatch Log Group
  LogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub '/aws/lambda/\${TransactionProcessorFunction}'
      RetentionInDays: 7

Outputs:
  TransactionProcessorFunction:
    Description: Lambda Function ARN
    Value: !GetAtt TransactionProcessorFunction.Arn

  InputBucketName:
    Description: S3 Bucket for input files
    Value: !Ref InputBucket

  TransactionsTableName:
    Description: DynamoDB Table Name
    Value: !Ref TransactionsTable

  SNSTopicArn:
    Description: SNS Topic ARN
    Value: !Ref TransactionsTopic`
    }
  };

  testing = {
    title: 'Testing y Local Development',
    unitTests: {
      titulo: 'Tests Unitarios con Jest',
      code: `// tests/unit/process-transaction.test.ts
import { handler } from '../../src/handlers/process-transaction';
import { S3Event, Context } from 'aws-lambda';

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('@aws-sdk/client-sns');

describe('Transaction Processor', () => {
  const mockContext: Context = {
    functionName: 'test-function',
    functionVersion: '1',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test',
    memoryLimitInMB: '512',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/test',
    logStreamName: 'test-stream',
    getRemainingTimeInMillis: () => 30000,
    done: () => {},
    fail: () => {},
    succeed: () => {},
    callbackWaitsForEmptyEventLoop: false
  };

  const mockS3Event: S3Event = {
    Records: [{
      eventVersion: '2.1',
      eventSource: 'aws:s3',
      awsRegion: 'us-east-1',
      eventTime: '2024-01-01T00:00:00.000Z',
      eventName: 'ObjectCreated:Put',
      s3: {
        s3SchemaVersion: '1.0',
        configurationId: 'test-config',
        bucket: {
          name: 'test-input-bucket',
          arn: 'arn:aws:s3:::test-input-bucket'
        },
        object: {
          key: 'input/transactions.csv',
          size: 1024,
          eTag: 'test-etag',
          sequencer: 'test-sequencer'
        }
      }
    }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TABLE_NAME = 'test-table';
    process.env.PROCESSED_BUCKET = 'test-processed';
    process.env.ERROR_BUCKET = 'test-error';
    process.env.SNS_TOPIC_ARN = 'arn:aws:sns:test';
  });

  it('should process valid CSV file successfully', async () => {
    // Setup mocks
    // ... mock implementations

    await handler(mockS3Event, mockContext);

    // Assertions
    expect(/* ... */).toHaveBeenCalled();
  });

  it('should move invalid file to error bucket', async () => {
    // Test error handling
  });
});`
    },
    localTesting: {
      titulo: 'Testing Local con SAM',
      code: `# Invocar Lambda localmente con evento de prueba
sam local invoke TransactionProcessorFunction \\
  --event events/s3-event.json

# events/s3-event.json
{
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "2024-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "test-bucket"
        },
        "object": {
          "key": "input/transactions.csv"
        }
      }
    }
  ]
}

# Ejecutar API Gateway local (si tienes endpoint HTTP)
sam local start-api

# Generar evento de S3 desde archivo real
sam local generate-event s3 put --bucket test-bucket --key input/test.csv > event.json

# Ejecutar tests
npm test

# Build para deployment
sam build`
    }
  };

  deployment = {
    title: 'Deployment y Monitoreo',
    deploy: {
      titulo: 'Deploy a AWS',
      code: `# Build del proyecto
sam build

# Validar template
sam validate

# Deploy guiado (primera vez)
sam deploy --guided

# Parámetros que pedirá:
# Stack Name: transaction-processor-prod
# AWS Region: us-east-1
# Confirm changes: Y
# Allow SAM CLI IAM role creation: Y
# Save arguments to config: Y

# Deploy subsecuentes
sam deploy

# Ver logs en tiempo real
sam logs -n TransactionProcessorFunction --tail

# Ver logs con filtro
sam logs -n TransactionProcessorFunction --filter "ERROR"

# Eliminar stack completo
sam delete`
    },
    monitoring: {
      titulo: 'Monitoreo y Alarmas',
      code: `# Agregar alarmas en template.yaml
Resources:
  # Alarma de errores
  ErrorAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub '\${AWS::StackName}-errors'
      AlarmDescription: Alert when Lambda has errors
      MetricName: Errors
      Namespace: AWS/Lambda
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 5
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: FunctionName
          Value: !Ref TransactionProcessorFunction
      AlarmActions:
        - !Ref TransactionsTopic

  # Alarma de duración
  DurationAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub '\${AWS::StackName}-duration'
      MetricName: Duration
      Namespace: AWS/Lambda
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 250000  # 250 segundos (83% del límite de 5min)
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: FunctionName
          Value: !Ref TransactionProcessorFunction

  # Dashboard de métricas
  Dashboard:
    Type: AWS::CloudWatch::Dashboard
    Properties:
      DashboardName: !Sub '\${AWS::StackName}-dashboard'
      DashboardBody: !Sub |
        {
          "widgets": [
            {
              "type": "metric",
              "properties": {
                "metrics": [
                  ["AWS/Lambda", "Invocations", {"stat": "Sum"}],
                  [".", "Errors", {"stat": "Sum"}],
                  [".", "Duration", {"stat": "Average"}]
                ],
                "period": 300,
                "stat": "Average",
                "region": "\${AWS::Region}",
                "title": "Lambda Metrics"
              }
            }
          ]
        }`
    }
  };

  bestPractices = {
    title: 'Best Practices Serverless',
    practices: [
      {
        icon: '⚡',
        categoria: 'Performance',
        good: [
          'Minimizar cold starts (usar Provisioned Concurrency si es crítico)',
          'Reutilizar conexiones SDK fuera del handler',
          'Limitar tamaño de deployment package (<50MB)',
          'Usar Lambda Layers para dependencias compartidas'
        ],
        bad: [
          'Crear nuevos clientes SDK en cada invocación',
          'Incluir dependencias innecesarias',
          'No implementar timeouts',
          'Código síncrono donde async es mejor'
        ]
      },
      {
        icon: '💰',
        categoria: 'Costos',
        good: [
          'Optimizar memoria (más memoria = más CPU = menor duración)',
          'Usar arquitectura ARM64 (20% más barato)',
          'Implementar circuit breakers para evitar reintentos infinitos',
          'Monitorear y ajustar tamaños de memoria'
        ],
        bad: [
          'Sobre-provisionar memoria sin medir',
          'Lambda para workloads constantes (mejor EC2/Fargate)',
          'No implementar retry policies',
          'Ignorar métricas de costos'
        ]
      },
      {
        icon: '🔒',
        categoria: 'Seguridad',
        good: [
          'Principio de mínimo privilegio en IAM policies',
          'Secrets en AWS Secrets Manager/Parameter Store',
          'Validar todo input externo',
          'Habilitar AWS X-Ray para tracing'
        ],
        bad: [
          'Roles IAM con permisos amplios',
          'Secrets hardcodeados en código',
          'Confiar en datos sin validar',
          'No implementar logging estructurado'
        ]
      }
    ]
  };

  summary = {
    title: 'Resumen: Serverless en Producción',
    achievements: [
      'Lambda function con TypeScript',
      'Procesamiento asíncrono escalable',
      'Infraestructura como código con SAM',
      'Integración S3, DynamoDB, SNS',
      'Monitoreo y alarmas en CloudWatch'
    ],
    features: [
      {
        icon: '☁️',
        title: 'Serverless',
        description: 'Zero administración de servidores'
      },
      {
        icon: '💰',
        title: 'Cost-Effective',
        description: 'Pay per use, escala a cero'
      },
      {
        icon: '📈',
        title: 'Auto-scaling',
        description: 'Miles de ejecuciones concurrentes'
      }
    ],
    nextSteps: [
      'Implementar Step Functions para workflows complejos',
      'Agregar API Gateway para endpoints HTTP',
      'CI/CD con GitHub Actions + SAM',
      'Multi-región con DynamoDB Global Tables',
      'Optimizar costos con análisis de métricas'
    ]
  };

  slides = [
    { type: 'title' },
    { type: 'context' },
    { type: 'setup' },
    { type: 'lambda-handler' },
    { type: 'sam-template' },
    { type: 'testing' },
    { type: 'deployment' },
    { type: 'best-practices' },
    { type: 'summary' }
  ];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }
}
