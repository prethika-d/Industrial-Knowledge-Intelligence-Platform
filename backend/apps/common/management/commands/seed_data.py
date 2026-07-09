import random
import uuid
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.analytics.models import Analytics
from apps.assistant.models import AIConversation
from apps.dashboard.models import Activity, SystemStatus
from apps.documents.models import Document
from apps.reports.models import Report
from apps.reports.services import generate_report_pdf

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with realistic demo data matching the INDUSMIND AI frontend mocks.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush', action='store_true',
            help='Delete existing seeded data before re-seeding.',
        )

    def handle(self, *args, **options):
        if options['flush']:
            self.stdout.write('Flushing existing data...')
            AIConversation.objects.all().delete()
            Report.objects.all().delete()
            Document.objects.all().delete()
            Activity.objects.all().delete()
            SystemStatus.objects.all().delete()
            Analytics.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        admin = self._get_or_create_user(
            'arun.kumar@indusmind.ai', 'Arun Kumar', 'admin', 'Line 3 — Chennai Plant',
        )
        engineer = self._get_or_create_user(
            'priya.raman@indusmind.ai', 'Priya Raman', 'engineer', 'Line 1 — Chennai Plant',
        )
        viewer = self._get_or_create_user(
            'karthik.subra@indusmind.ai', 'Karthik Subramaniam', 'viewer', 'Line 3 — Chennai Plant',
        )

        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(email='admin@indusmind.ai', password='ChangeMe123!', name='Platform Admin')
            self.stdout.write(self.style.SUCCESS('Created superuser admin@indusmind.ai / ChangeMe123!'))

        self._seed_system_status()
        self._seed_activity(admin, engineer)
        documents = self._seed_documents(admin, engineer)
        self._seed_ai_conversations(admin, viewer)
        self._seed_reports(admin, engineer)
        self._seed_analytics()

        self.stdout.write(self.style.SUCCESS('Seed data created successfully.'))

    # ------------------------------------------------------------------
    def _get_or_create_user(self, email, name, role, facility):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'name': name, 'role': role, 'facility': facility},
        )
        if created:
            user.set_password('Password123!')
            user.save()
            self.stdout.write(f'  created user {email} (password: Password123!)')
        return user

    def _seed_system_status(self):
        systems = [
            ('AI Engine', 142, 99.98),
            ('Knowledge Base', 58, 99.99),
            ('Database', 21, 99.99),
            ('Document Index', 89, 99.95),
        ]
        for name, latency, uptime in systems:
            SystemStatus.objects.update_or_create(
                service_name=name,
                defaults={'status': 'Operational', 'latency_ms': latency,
                          'uptime_percentage': uptime, 'health_percentage': 100},
            )
        self.stdout.write(f'  seeded {len(systems)} system status rows')

    def _seed_activity(self, admin, engineer):
        now = timezone.now()
        entries = [
            (Activity.Action.UPLOAD, 'Compressor SOP-14.pdf uploaded to Line 3 knowledge base', admin, 6),
            (Activity.Action.QUERY_RESOLVED, 'Query resolved: "Torque spec for hydraulic pump housing?"', engineer, 24),
            (Activity.Action.REPORT_GENERATED, 'Weekly maintenance report generated for Unit 7', admin, 60),
            (Activity.Action.DOCUMENT_INDEXED, 'Boiler Safety Manual Rev.3 indexed successfully', engineer, 180),
        ]
        for action, text, user, minutes_ago in entries:
            activity = Activity.objects.create(action=action, text=text, user=user)
            Activity.objects.filter(pk=activity.pk).update(timestamp=now - timedelta(minutes=minutes_ago))
        self.stdout.write(f'  seeded {len(entries)} activity entries')

    def _seed_documents(self, admin, engineer):
        samples = [
            ('Compressor_SOP-14.pdf', 'pdf', 'sop', 842_000, 'indexed'),
            ('Boiler_Safety_Manual_Rev3.pdf', 'pdf', 'safety', 3_150_000, 'indexed'),
            ('Line3_Maintenance_Log.docx', 'docx', 'maintenance', 245_000, 'indexed'),
            ('Unit7_Inspection_Findings.pdf', 'pdf', 'inspection_report', 1_020_000, 'processing'),
            ('Hydraulic_Pump_Housing_Spec.txt', 'txt', 'manual', 18_500, 'indexed'),
        ]
        created = []
        for filename, ftype, category, size, status in samples:
            doc, was_created = Document.objects.get_or_create(
                filename=filename,
                defaults=dict(
                    original_name=filename,
                    file_type=ftype,
                    size=size,
                    category=category,
                    uploaded_by=random.choice([admin, engineer]),
                    processing_status=status,
                ),
            )
            if was_created and not doc.file:
                doc.file.save(filename, ContentFile(b'Seed placeholder content for ' + filename.encode()), save=True)
            created.append(doc)
        self.stdout.write(f'  seeded {len(created)} documents')
        return created

    def _seed_ai_conversations(self, admin, viewer):
        qa_pairs = [
            ("What is the torque spec for the hydraulic pump housing?",
             "The hydraulic pump housing bolts should be torqued to 85 Nm in a criss-cross "
             "pattern, per the manufacturer spec sheet.",
             ['Hydraulic Pump Housing Spec Sheet']),
            ("Summarize the last inspection report for Line 3",
             "The most recent Line 3 inspection found no critical defects; two minor wear "
             "items were flagged on the conveyor belt for monitoring.",
             ['Unit 7 Inspection Findings', 'Line 3 Maintenance Log']),
            ("What safety gear is required for boiler maintenance?",
             "Boiler maintenance requires heat-resistant gloves, safety goggles, steel-toe "
             "boots, and a face shield when working near pressurized components.",
             ['Boiler Safety Manual Rev.3']),
        ]
        session = uuid.uuid4()
        for query, response, sources in qa_pairs:
            AIConversation.objects.create(
                session_id=session, user=random.choice([admin, viewer]),
                query=query, response=response, sources=sources, model_used='mock-assistant-v1',
            )
        self.stdout.write(f'  seeded {len(qa_pairs)} AI conversation turns')

    def _seed_reports(self, admin, engineer):
        samples = [
            ('Line 3 Weekly Maintenance Summary', 'Maintenance', 'ready'),
            ('Boiler Safety Compliance Audit', 'Safety', 'ready'),
            ('Hydraulic Pump Fault Analysis', 'Engineering', 'processing'),
            ('Q2 Knowledge Base Usage Report', 'Analytics', 'ready'),
            ('Unit 7 Inspection Findings', 'Quality', 'ready'),
            ('Conveyor Belt Wear Assessment', 'Maintenance', 'failed'),
        ]
        for title, rtype, status in samples:
            report, created = Report.objects.get_or_create(
                title=title,
                defaults=dict(report_type=rtype, generated_by=random.choice([admin, engineer]), status='processing'),
            )
            if created and status == 'ready':
                generate_report_pdf(report)
            elif created:
                report.status = status
                report.save(update_fields=['status'])
        self.stdout.write(f'  seeded {len(samples)} reports')

    def _seed_analytics(self):
        Analytics.objects.get_or_create(
            metric_name='query_accuracy', period='current',
            defaults={'value': 94.2, 'unit': '%', 'delta_label': '+1.8% vs last month'},
        )
        Analytics.objects.get_or_create(
            metric_name='avg_response_time', period='current',
            defaults={'value': 1.4, 'unit': 'sec', 'delta_label': '-0.3s vs last month'},
        )
        Analytics.objects.get_or_create(
            metric_name='monthly_active_users', period='current',
            defaults={'value': 312, 'unit': 'users', 'delta_label': '+24 vs last month'},
        )
        Analytics.objects.get_or_create(
            metric_name='query_growth', period='current',
            defaults={'value': 27, 'unit': '%', 'delta_label': 'month over month'},
        )

        growth = [
            ('Jan', 420, 60), ('Feb', 680, 88), ('Mar', 910, 102),
            ('Apr', 1240, 140), ('May', 1580, 165), ('Jun', 2010, 198),
        ]
        for month, queries, uploads in growth:
            Analytics.objects.get_or_create(metric_name='queries', period=month, defaults={'value': queries})
            Analytics.objects.get_or_create(metric_name='uploads', period=month, defaults={'value': uploads})

        departments = [
            ('Maintenance', 3420), ('Operations', 2680), ('Quality', 1590),
            ('Safety', 1120), ('Engineering', 980),
        ]
        for dept, value in departments:
            Analytics.objects.get_or_create(
                metric_name='department_usage', dimension=dept, period='current',
                defaults={'value': value},
            )
        self.stdout.write('  seeded analytics metrics (overview, growth chart, department usage)')
