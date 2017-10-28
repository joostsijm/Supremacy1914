"""add site_id to user

Revision ID: ab9560dfbd74
Revises: c18cd94914ec
Create Date: 2017-10-28 10:24:39.503361

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab9560dfbd74'
down_revision = 'c18cd94914ec'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('sp_users', sa.Column('site_id', sa.Integer(), nullable=False))
    op.create_unique_constraint(None, 'sp_users', ['site_id'])


def downgrade():
    op.drop_constraint(None, 'sp_users', type_='unique')
    op.drop_column('sp_users', 'site_id')
