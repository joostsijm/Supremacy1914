"""chagne relation status name



Revision ID: c786de9727ed
Revises: ab9560dfbd74
Create Date: 2017-10-29 00:04:11.621967

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c786de9727ed'
down_revision = 'ab9560dfbd74'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('sp_relations', sa.Column('status', sa.Integer(), nullable=True))
    op.drop_column('sp_relations', 'relation')


def downgrade():
    op.add_column('sp_relations', sa.Column('relation', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('sp_relations', 'status')
